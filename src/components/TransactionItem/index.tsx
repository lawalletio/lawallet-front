'use client'

import {
  CreditCardIcon,
  TransferIcon,
  LightningIcon
} from '@bitcoin-design/bitcoin-icons-react/filled'

import { Flex, Text, Accordion, AccordionBody, Button } from '@/components/UI'

import theme from '@/styles/theme'
import { Transaction, TransactionStatus } from '@/types/transaction'
import { useContext, useMemo } from 'react'
import { LaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/hooks/useTranslations'
import { dateFormatter, formatToPreference } from '@/lib/formatter'
import { defaultCurrency } from '@/types/config'

interface ComponentProps {
  transaction: Transaction
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

  if (!satsAmount) return null

  return (
    <>
      <Accordion
        variant="borderless"
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
                    {!isFromMe &&
                      !(transaction.status === TransactionStatus.ERROR) &&
                      '+ '}
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
                <Text>Lightning</Text>
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
                      new Date(Number(transaction.createdAt) * 1000),
                      'HH:mm'
                    )}
                  </Text>
                  <Text size="small" color={theme.colors.gray50}>
                    {dateFormatter(
                      lng,
                      new Date(Number(transaction.createdAt) * 1000),
                      'MMMM d, yyyy'
                    )}
                  </Text>
                </Flex>
              </Flex>
            </li>
            {/* <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={theme.colors.gray50}>
                  {t('FEE')}
                </Text>
                <Flex direction="column" align="end">
                  <Text>1 SAT</Text>
                  <Text size="small" color={theme.colors.gray50}>
                    {'>'}$0.01 {currency}
                  </Text>
                </Flex>
              </Flex>
            </li> */}
            <li>
              <Flex align="center" justify="space-between">
                <Text size="small" color={theme.colors.gray50}>
                  {t('STATUS')}
                </Text>
                <Text>{t(status)}</Text>
              </Flex>
            </li>
          </ul>
          <Flex>
            <Button variant="bezeled" onClick={() => null}>
              {t('SHARE')}
            </Button>
          </Flex>
        </AccordionBody>
      </Accordion>
    </>
  )
}
