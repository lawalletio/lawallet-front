'use client'

import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import HeroCard from '@/components/HeroCard'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  LinkButton,
  Avatar,
  Icon,
  Feedback
} from '@/components/UI'

import { useContext, useEffect, useMemo, useState } from 'react'
import { LaWalletContext } from '@/context/LaWalletContext'
import { TransferTypes } from '@/types/transaction'
import { formatAddress, formatToPreference } from '@/lib/formatter'
import { useTranslation } from '@/context/TranslateContext'
import { useTransferContext } from '@/context/TransferContext'
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'

export default function Page() {
  const { lng, t } = useTranslation()
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false)

  const { loading, transferInfo, executeTransfer } = useTransferContext()
  const {
    identity,
    balance,
    userConfig: {
      props: { currency }
    },
    converter: { pricesData, convertCurrency }
  } = useContext(LaWalletContext)

  const convertedAmount: string = useMemo(() => {
    const convertedInt: number = convertCurrency(
      transferInfo.amount,
      'SAT',
      currency
    )

    return formatToPreference(currency, convertedInt, lng)
  }, [transferInfo.amount, pricesData, currency])

  useEffect(() => {
    if (balance.amount < transferInfo.amount) setInsufficientBalance(true)
  }, [transferInfo.amount])

  const [transferUsername, transferDomain] = transferInfo.data.split('@')

  useActionOnKeypress('Enter', () => executeTransfer(identity.privateKey), [
    identity,
    transferInfo
  ])

  return (
    <>
      <Navbar showBackPage={true} title={t('VALIDATE_INFO')} />

      <HeroCard>
        <Container>
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap={8}
            flex={1}
          >
            {transferInfo.type === TransferTypes.LNURLW ? (
              <Text size="small">{t('CLAIM_THIS_INVOICE')}</Text>
            ) : (
              <Avatar size="large">
                <Text size="small">
                  {transferUsername.substring(0, 2).toUpperCase()}
                </Text>
              </Avatar>
            )}

            {transferInfo.type === TransferTypes.INVOICE ||
            transferInfo.type === TransferTypes.LNURLW ? (
              <Flex justify="center">
                <Text>{formatAddress(transferInfo.data, 15)}</Text>
              </Flex>
            ) : (
              <Flex justify="center">
                <Text>
                  {transferUsername}@{transferDomain}
                </Text>
              </Flex>
            )}
          </Flex>
        </Container>
      </HeroCard>

      <Container size="small">
        <Divider y={16} />
        <Flex
          direction="column"
          flex={1}
          justify="center"
          align="center"
          gap={8}
        >
          <Heading as="h6">Total</Heading>

          {Number(convertedAmount) !== 0 ? (
            <Flex align="center" justify="center" gap={4}>
              {currency === 'SAT' ? (
                <Icon size="small">
                  <SatoshiV2Icon />
                </Icon>
              ) : (
                <Text>$</Text>
              )}
              <Heading>{convertedAmount}</Heading>
              <Text>{currency}</Text>
            </Flex>
          ) : (
            <Flex align="center" justify="center" gap={4}>
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
              <Heading>{transferInfo.amount}</Heading>
              <Text>SAT</Text>
            </Flex>
          )}
        </Flex>
        <Divider y={16} />
      </Container>

      {transferInfo.expired ||
        (transferInfo.type !== TransferTypes.LNURLW &&
          !balance.loading &&
          insufficientBalance && (
            <Flex flex={1} align="center" justify="center">
              <Feedback show={true} status={'error'}>
                {transferInfo.expired
                  ? t('INVOICE_EXPIRED')
                  : t('INSUFFICIENT_BALANCE')}
              </Feedback>
            </Flex>
          ))}

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <LinkButton variant="bezeledGray" href="/dashboard">
              {t('CANCEL')}
            </LinkButton>

            <Button
              color="secondary"
              onClick={() => executeTransfer(identity.privateKey)}
              disabled={
                !transferInfo.type ||
                loading ||
                transferInfo.expired ||
                (transferInfo.type !== TransferTypes.LNURLW &&
                  insufficientBalance)
              }
              loading={loading}
            >
              {transferInfo.type === TransferTypes.LNURLW
                ? t('CLAIM')
                : t('TRANSFER')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
