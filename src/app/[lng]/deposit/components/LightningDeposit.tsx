'use client'

import {
  CheckIcon,
  SatoshiV2Icon
} from '@bitcoin-design/bitcoin-icons-react/filled'
import { NDKKind } from '@nostr-dev-kit/ndk'
import { useContext, useEffect, useMemo, useState } from 'react'

import { LaWalletContext } from '@/context/LaWalletContext'

import { formatAddress, formatToPreference } from '@/lib/formatter'
import lnurl from '@/lib/lnurl'
import { copy, share } from '@/lib/share'

import { useNumpad } from '@/hooks/useNumpad'
import { useSubscription } from '@/hooks/useSubscription'
import { useTranslation } from '@/hooks/useTranslations'

import Container from '@/components/Layout/Container'
import { BtnLoader } from '@/components/Loader/Loader'
import TokenList from '@/components/TokenList'
import {
  Button,
  Confetti,
  Divider,
  Feedback,
  Flex,
  Heading,
  Icon,
  Keyboard,
  QRCode,
  Sheet,
  Text
} from '@/components/UI'

import {
  LAWALLET_ENDPOINT,
  MAX_INVOICE_AMOUNT,
  WALLET_DOMAIN
} from '@/constants/config'
import keys from '@/constants/keys'
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'
import useErrors from '@/hooks/useErrors'
import { requestInvoice } from '@/interceptors/transaction'
import { buildZapRequestEvent, getTag } from '@/lib/events'
import theme from '@/styles/theme'
import { useRouter } from 'next/navigation'

type InvoiceProps = {
  bolt11: string
  created_at: number
  loading: boolean
}

type SheetTypes = 'amount' | 'qr' | 'finished'

const LightningDeposit = () => {
  const { t } = useTranslation()
  const {
    identity,
    sortedTransactions,
    lng,
    notifications,
    userConfig: {
      props: { currency }
    },
    converter: { convertCurrency }
  } = useContext(LaWalletContext)
  const numpadData = useNumpad(currency)

  const router = useRouter()
  const errors = useErrors()
  const [showSheet, setShowSeet] = useState<boolean>(false)
  const [sheetStep, setSheetStep] = useState<SheetTypes>('amount')

  const [invoice, setInvoice] = useState<InvoiceProps>({
    bolt11: '',
    created_at: 0,
    loading: false
  })

  const { events } = useSubscription({
    filters: [
      {
        authors: [keys.ledgerPubkey, keys.urlxPubkey],
        kinds: [9735],
        since: invoice.created_at
      }
    ],
    options: {},
    enabled: Boolean(invoice.bolt11.length && !(sheetStep === 'finished'))
  })

  const handleClick = async () => {
    if (invoice.loading) return

    const amountSats: number = numpadData.intAmount['SAT']
    if (amountSats < 1 || amountSats > MAX_INVOICE_AMOUNT) {
      const convertedMinAmount: number = convertCurrency(1, 'SAT', currency)
      const convertedMaxAmount: number = convertCurrency(
        MAX_INVOICE_AMOUNT,
        'SAT',
        currency
      )

      errors.modifyError('ERROR_INVOICE_AMOUNT', {
        minAmount: convertedMinAmount.toString(),
        maxAmount: formatToPreference(currency, convertedMaxAmount, lng),
        currency: currency
      })
      return
    }

    setInvoice({ ...invoice, loading: true })
    const invoice_mSats: number = amountSats * 1000
    const zapRequest: string = await buildZapRequestEvent(
      invoice_mSats,
      identity.privateKey
    )

    requestInvoice(
      `${LAWALLET_ENDPOINT}/lnurlp/${identity.npub}/callback?amount=${invoice_mSats}&nostr=${zapRequest}`
    )
      .then(bolt11 => {
        if (bolt11) {
          setInvoice({
            bolt11,
            created_at: Math.round(Date.now() / 1000),
            loading: false
          })

          setSheetStep('qr')
        } else {
          errors.modifyError('ERROR_ON_CREATE_INVOICE')
        }
        return
      })
      .catch(() => errors.modifyError('ERROR_ON_CREATE_INVOICE'))
  }

  const handleCloseSheet = () => {
    if (sheetStep === 'finished' || !identity.username.length) {
      router.push('/dashboard')
    } else {
      numpadData.resetAmount()
      setShowSeet(false)
      setSheetStep('amount')
      setInvoice({ bolt11: '', created_at: 0, loading: false })
    }
  }

  const handleShareInvoice = () => {
    const shareData = {
      title: t('SHARE_INVOICE_TITLE'),
      description: t('SHARE_INVOICE'),
      text: invoice.bolt11
    }

    const shared: boolean = share(shareData)
    if (!shared) handleCopy(invoice.bolt11)
  }

  useEffect(() => {
    if (events.length) {
      events.map(event => {
        const boltTag = event.getMatchingTags('bolt11')[0]?.[1]
        if (boltTag === invoice.bolt11) setSheetStep('finished')
      })
    }
  }, [events.length])

  useEffect(() => {
    if (sortedTransactions.length) {
      const receivedTX = sortedTransactions.find(tx => {
        const boltTag = getTag(tx.events[0].tags, 'bolt11')
        return boltTag === invoice.bolt11
      })

      // POC: uncomment validation
      // if (receivedTX) setSheetStep('finished')
    }
  }, [sortedTransactions.length])

  const handleCopy = (text: string) => {
    copy(text).then(res => {
      notifications.showAlert({
        description: res ? 'SUCCESS_COPY' : 'ERROR_COPY',
        type: res ? 'success' : 'error'
      })
    })
  }

  useEffect(() => {
    if (errors.errorInfo.visible) errors.resetError()
  }, [numpadData.intAmount])

  useActionOnKeypress('Enter', handleClick, [numpadData.intAmount['SAT']])

  const LNURLEncoded: string = useMemo(
    () =>
      lnurl
        .encode(
          `https://${WALLET_DOMAIN}/.well-known/lnurlp/${
            identity.username ? identity.username : identity.npub
          }`
        )
        .toUpperCase(),
    [identity]
  )

  return (
    <>
      {identity.username.length ? (
        <>
          <Flex flex={1} justify="center" align="center">
            <QRCode value={('lightning:' + LNURLEncoded).toUpperCase()} />
          </Flex>
          <Flex>
            <Container size="small">
              <Divider y={16} />

              <Flex align="center">
                <Flex direction="column">
                  <Text size="small" color={theme.colors.gray50}>
                    {t('USER')}
                  </Text>
                  <Flex>
                    <Text>
                      {identity.username
                        ? `${identity.username}@${WALLET_DOMAIN}`
                        : formatAddress(LNURLEncoded, 20)}
                    </Text>
                  </Flex>
                </Flex>
                <div>
                  <Button
                    size="small"
                    variant="bezeled"
                    onClick={() =>
                      handleCopy(
                        identity.username
                          ? `${identity.username}@${WALLET_DOMAIN}`
                          : LNURLEncoded
                      )
                    }
                  >
                    {t('COPY')}
                  </Button>
                </div>
              </Flex>

              <Divider y={16} />
            </Container>
          </Flex>

          <Flex>
            <Container size="small">
              <Divider y={16} />
              <Flex gap={8}>
                <Button
                  variant="bezeled"
                  onClick={() => {
                    setShowSeet(true)
                  }}
                >
                  {t('CREATE_INVOICE')}
                </Button>
              </Flex>
              <Divider y={32} />
            </Container>
          </Flex>
        </>
      ) : null}

      <Sheet
        title={
          sheetStep === 'amount'
            ? t('DEFINE_AMOUNT')
            : sheetStep === 'qr'
            ? t('WAITING_PAYMENT')
            : t('PAYMENT_RECEIVED')
        }
        isOpen={showSheet || !identity.username.length}
        onClose={handleCloseSheet}
      >
        {sheetStep === 'amount' && (
          <>
            <Container size="small">
              <Flex
                direction="column"
                gap={8}
                flex={1}
                justify="center"
                align="center"
              >
                <Flex justify="center" align="center" gap={4}>
                  {currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                  <Heading>
                    {formatToPreference(
                      currency,
                      numpadData.intAmount[numpadData.usedCurrency],
                      lng
                    )}
                  </Heading>
                </Flex>
                <TokenList />

                <Feedback show={errors.errorInfo.visible} status={'error'}>
                  {errors.errorInfo.text}
                </Feedback>
              </Flex>
              <Divider y={24} />
              <Flex gap={8}>
                <Button
                  onClick={handleClick}
                  disabled={
                    invoice.loading || numpadData.intAmount['SAT'] === 0
                  }
                >
                  {invoice.loading ? <BtnLoader /> : t('GENERATE')}
                </Button>
              </Flex>
              <Divider y={24} />
              <Keyboard numpadData={numpadData} />
            </Container>
          </>
        )}

        {sheetStep === 'qr' && (
          <>
            <Flex flex={1} justify="center" align="center">
              <QRCode value={`${invoice.bolt11.toUpperCase()}`} />
            </Flex>
            <Divider y={24} />
            <Container size="small">
              <Flex
                direction="column"
                justify="center"
                align="center"
                flex={1}
                gap={8}
              >
                <BtnLoader />
                <Text size="small" color={theme.colors.gray50}>
                  {t('WAITING_PAYMENT_OF')}
                </Text>
                <Flex justify="center" align="center" gap={4}>
                  {currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                  <Heading>
                    {formatToPreference(
                      currency,
                      numpadData.intAmount[numpadData.usedCurrency],
                      lng
                    )}{' '}
                  </Heading>

                  <Text>{currency}</Text>
                </Flex>
              </Flex>
              <Divider y={24} />
              <Flex gap={8}>
                <Button variant="bezeledGray" onClick={handleCloseSheet}>
                  {t('CANCEL')}
                </Button>
                <Button
                  variant="bezeled"
                  onClick={() => handleCopy(invoice.bolt11)}
                >
                  {t('COPY')}
                </Button>
              </Flex>
            </Container>
          </>
        )}

        {sheetStep === 'finished' && (
          <>
            <Confetti />
            <Container size="small">
              <Flex
                direction="column"
                justify="center"
                flex={1}
                align="center"
                gap={8}
              >
                <Icon color={theme.colors.primary}>
                  <CheckIcon />
                </Icon>
                <Text size="small" color={theme.colors.gray50}>
                  {t('PAYMENT_RECEIVED')}
                </Text>
                <Flex justify="center" align="center" gap={4}>
                  {currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                  <Heading>
                    {formatToPreference(
                      currency,
                      numpadData.intAmount[numpadData.usedCurrency],
                      lng
                    )}
                  </Heading>
                </Flex>
              </Flex>
              <Flex gap={8}>
                <Button variant="bezeledGray" onClick={handleCloseSheet}>
                  {t('CLOSE')}
                </Button>
              </Flex>
            </Container>
          </>
        )}
      </Sheet>
    </>
  )
}

export default LightningDeposit
