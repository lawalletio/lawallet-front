'use client'

import {
  CheckIcon,
  SatoshiV2Icon
} from '@bitcoin-design/bitcoin-icons-react/filled'
import { NDKKind } from '@nostr-dev-kit/ndk'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useContext, useEffect, useState } from 'react'

import { LaWalletContext } from '@/context/LaWalletContext'

import { formatToPreference } from '@/lib/formatter'
import lnurl from '@/lib/lnurl'
import { copy, share } from '@/lib/share'

import { useNumpad } from '@/hooks/useNumpad'
import { useSubscription } from '@/hooks/useSubscription'
import { useTranslation } from '@/hooks/useTranslations'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { BtnLoader } from '@/components/Loader/Loader'
import TokenList from '@/components/TokenList'
import {
  Button,
  Confetti,
  Divider,
  Flex,
  Heading,
  Icon,
  Keyboard,
  QRCode,
  Sheet,
  Text
} from '@/components/UI'

import { LAWALLET_ENDPOINT, WALLET_DOMAIN } from '@/constants/config'
import keys from '@/constants/keys'
import { requestInvoice } from '@/interceptors/transaction'
import { zapRequestEvent } from '@/lib/events'
import theme from '@/styles/theme'
import { useRouter } from 'next/navigation'

type InvoiceProps = {
  bolt11: string
  created_at: number
  loading: boolean
}

type SheetTypes = 'amount' | 'qr' | 'finished'

export default function Page() {
  const { t } = useTranslation()
  const { identity, lng, notifications, userConfig } =
    useContext(LaWalletContext)
  const numpadData = useNumpad(userConfig.props.currency)

  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)')

  const isMediumDevice = useMediaQuery(
    'only screen and (min-width : 769px) and (max-width : 992px)'
  )

  const router = useRouter()
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
        kinds: [9735 as NDKKind],
        since: invoice.created_at
      }
    ],
    options: {},
    enabled: Boolean(invoice.bolt11.length && !(sheetStep === 'finished'))
  })

  const handleClick = async () => {
    if (invoice.loading) return

    setInvoice({ ...invoice, loading: true })
    const invoice_mSats: number = numpadData.intAmount['SAT'] * 1000
    const zapRequest: string = await zapRequestEvent(invoice_mSats, identity)

    requestInvoice(
      `${LAWALLET_ENDPOINT}/lnurlp/${identity.npub}/callback?amount=${invoice_mSats}&nostr=${zapRequest}`
    )
      .then(bolt11 => {
        setInvoice({
          bolt11,
          created_at: Math.round(Date.now() / 1000),
          loading: false
        })

        setSheetStep('qr')
        return
      })
      .catch(err => console.log(err))
  }

  const handleCloseSheet = () => {
    if (sheetStep === 'finished') {
      router.push('/dashboard')
    } else {
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

  const handleCopy = (text: string) => {
    copy(text).then(res => {
      notifications.showAlert({
        description: res ? 'SUCCESS_COPY' : 'ERROR_COPY',
        type: res ? 'success' : 'error'
      })
    })
  }

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('DEPOSIT')}</Heading>
        </Flex>
      </Navbar>

      <QRCode
        size={325}
        value={(
          'lightning://' +
          lnurl.encode(
            `https://${WALLET_DOMAIN}/.well-known/lnurlp/${identity.username}`
          )
        ).toUpperCase()}
      />

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex align="center">
            <Flex direction="column">
              <Text size="small" color={theme.colors.gray50}>
                {t('USER')}
              </Text>
              <Flex>
                <Text>{identity.username}</Text>
                <Text>@{WALLET_DOMAIN}</Text>
              </Flex>
            </Flex>
            <div>
              <Button
                size="small"
                variant="bezeled"
                onClick={() =>
                  handleCopy(`${identity.username}@${WALLET_DOMAIN}`)
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
                numpadData.resetAmount()
                setShowSeet(true)
              }}
            >
              {t('CREATE_INVOICE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>

      <Sheet
        title={
          sheetStep === 'amount'
            ? t('DEFINE_AMOUNT')
            : sheetStep === 'qr'
            ? t('WAITING_PAYMENT')
            : t('PAYMENT_RECEIVED')
        }
        isOpen={showSheet}
        onClose={handleCloseSheet}
      >
        {sheetStep === 'amount' && (
          <>
            <Container size="small">
              <Flex direction="column" gap={8} flex={1} justify="center">
                <Flex justify="center" align="center" gap={4}>
                  {userConfig.props.currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                  <Heading>
                    {formatToPreference(
                      userConfig.props.currency,
                      numpadData.intAmount[numpadData.usedCurrency],
                      lng
                    )}
                  </Heading>
                </Flex>
                <TokenList />
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
            <QRCode size={325} value={`${invoice.bolt11.toUpperCase()}`} />
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
                  {userConfig.props.currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                  <Heading>
                    {formatToPreference(
                      userConfig.props.currency,
                      numpadData.intAmount[numpadData.usedCurrency],
                      lng
                    )}{' '}
                  </Heading>

                  <Text>{userConfig.props.currency}</Text>
                </Flex>
              </Flex>
              <Divider y={24} />
              <Flex gap={8}>
                <Button variant="bezeledGray" onClick={handleCloseSheet}>
                  {t('CANCEL')}
                </Button>
                {isSmallDevice || isMediumDevice ? (
                  <Button variant="bezeled" onClick={handleShareInvoice}>
                    {t('SHARE')}
                  </Button>
                ) : (
                  <Button
                    variant="bezeled"
                    onClick={() => handleCopy(invoice.bolt11)}
                  >
                    {t('COPY')}
                  </Button>
                )}
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
                  {userConfig.props.currency === 'SAT' ? (
                    <Icon size="small">
                      <SatoshiV2Icon />
                    </Icon>
                  ) : (
                    <Text>$</Text>
                  )}
                  <Heading>
                    {formatToPreference(
                      userConfig.props.currency,
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
