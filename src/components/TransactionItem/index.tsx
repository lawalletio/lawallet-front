'use client'

import {
  CreditCardIcon,
  TransferIcon,
  LightningIcon
} from '@bitcoin-design/bitcoin-icons-react/filled'

import { Flex, Text, Accordion, AccordionBody } from '@/components/UI'

import theme from '@/styles/theme'
import {
  Transaction,
  TransactionDirection,
  TransactionStatus,
  TransactionType
} from '@/types/transaction'
import { useContext, useMemo, useState } from 'react'
import { LaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/hooks/useTranslations'
import { dateFormatter, formatToPreference } from '@/lib/formatter'
import { defaultCurrency } from '@/types/config'
import { getUsername } from '@/interceptors/identity'
import { WALLET_DOMAIN } from '@/constants/config'
import { BtnLoader } from '../Loader/Loader'
import { getMultipleTags } from '@/lib/events'

interface ComponentProps {
  transaction: Transaction
}

type LudInfoProps = {
  loading: boolean
  data: string
}

export default function Component({ transaction }: ComponentProps) {
  if (!transaction) return null

  const { t } = useTranslation()
  const { status, type } = transaction
  const {
    lng,
    userConfig: {
      props: { hideBalance, currency }
    },
    converter: { pricesData, convertCurrency }
  } = useContext(LaWalletContext)

  const isFromMe = transaction?.direction === 'OUTGOING'
  const satsAmount = transaction.tokens?.BTC / 1000 || 0

  const [ludInfo, setLudInfo] = useState<LudInfoProps>({
    loading: false,
    data: 'Lightning'
  })

  const listTypes = {
    CARD: { icon: <CreditCardIcon />, label: t('YOU_PAID') },
    INTERNAL: { icon: <TransferIcon />, label: t('YOU_TRANSFER') },
    LN: { icon: <LightningIcon />, label: t('YOU_SEND') }
  }

  const convertedFiatAmount = useMemo(
    () =>
      convertCurrency(
        satsAmount,
        'SAT',
        currency === 'SAT' ? defaultCurrency : currency
      ),
    [pricesData, currency]
  )

  const handleOpenAccordion = async () => {
    if (transaction.type === TransactionType.INTERNAL) {
      setLudInfo({ ...ludInfo, loading: true })

      let username: string = ''
      if (transaction.direction === TransactionDirection.INCOMING) {
        username = await getUsername(transaction.events[0].pubkey)
      } else {
        const txPubkeys: string[] = getMultipleTags(
          transaction.events[0].tags,
          'p'
        )
        if (txPubkeys.length < 2) return

        const receiverPubkey: string = txPubkeys[1]
        username = await getUsername(receiverPubkey)
      }

      username.length
        ? setLudInfo({ loading: false, data: `${username}@${WALLET_DOMAIN}` })
        : setLudInfo({ ...ludInfo, loading: false })
    }
  }

  if (!satsAmount) return null

  return (
    <>
      <Accordion
        variant="borderless"
        onOpen={handleOpenAccordion}
        trigger={
          <Flex align="center" gap={8}>
            <Flex align="center" gap={8}>
              {/* <Icon>{listTypes[type].icon}</Icon> */}
              <Text>
                {transaction.status === TransactionStatus.REVERTED
                  ? t('TX_REVERTED')
                  : transaction.status === TransactionStatus.ERROR
                  ? t('FAILED_TRANSACTION')
                  : transaction.status === TransactionStatus.PENDING
                  ? t(
                      `PENDING_${
                        !isFromMe ? 'INBOUND' : 'OUTBOUND'
                      }_TRANSACTION`
                    )
                  : isFromMe
                  ? listTypes[type].label
                  : t('YOU_RECEIVE')}
              </Text>
            </Flex>
            <Flex direction="column" align="end">
              <Text
                color={
                  hideBalance
                    ? theme.colors.text
                    : transaction.status === TransactionStatus.ERROR ||
                      transaction.status === TransactionStatus.REVERTED
                    ? theme.colors.error
                    : transaction.status === TransactionStatus.PENDING
                    ? theme.colors.warning
                    : isFromMe
                    ? theme.colors.text
                    : theme.colors.success
                }
              >
                {hideBalance ? (
                  '*****'
                ) : (
                  <>
                    {!(transaction.status === TransactionStatus.ERROR) && (
                      <>{!isFromMe ? '+ ' : '- '}</>
                    )}
                    {formatToPreference('SAT', satsAmount, lng)} SAT
                  </>
                )}
              </Text>
              <Text size="small" color={theme.colors.gray50}>
                {hideBalance
                  ? '*****'
                  : `$${formatToPreference(
                      currency === 'SAT' ? defaultCurrency : currency,
                      convertedFiatAmount,
                      lng,
                      true
                    )} ${currency === 'SAT' ? defaultCurrency : currency}`}
              </Text>
            </Flex>
          </Flex>
        }
      >
        <AccordionBody>
          <ul>
            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={theme.colors.gray50}>
                  {isFromMe ? t('TO') : t('FROM')}
                </Text>
                <Text>{ludInfo.loading ? <BtnLoader /> : ludInfo.data}</Text>
              </Flex>
            </li>
            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={theme.colors.gray50}>
                  {t('DATE')}
                </Text>
                <Flex direction="column" align="end">
                  <Text>
                    {dateFormatter(
                      lng,
                      new Date(Number(transaction.createdAt)),
                      'HH:mm'
                    )}
                  </Text>
                  <Text size="small" color={theme.colors.gray50}>
                    {dateFormatter(
                      lng,
                      new Date(Number(transaction.createdAt)),
                      'MMMM d, yyyy'
                    )}
                  </Text>
                </Flex>
              </Flex>
            </li>
            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={theme.colors.gray50}>
                  {t('STATUS')}
                </Text>
                <Text>{t(status)}</Text>
              </Flex>
            </li>
          </ul>
          {/* <Flex>
            <Button variant="bezeled" onClick={() => null}>
              {t('SHARE')}
            </Button>
          </Flex> */}
        </AccordionBody>
      </Accordion>
    </>
  )
}
