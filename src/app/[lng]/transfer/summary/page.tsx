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

import theme from '@/styles/theme'
import { useContext, useMemo } from 'react'
import { LaWalletContext } from '@/context/LaWalletContext'
import { TransferTypes } from '@/types/transaction'
import { formatAddress, formatToPreference } from '@/lib/formatter'
import { useTranslation } from '@/hooks/useTranslations'
import { useTransferContext } from '@/context/TransferContext'
import { BtnLoader } from '@/components/Loader/Loader'
import { useTokenBalance } from '@/hooks/useTokenBalance'

export default function Page() {
  const { t } = useTranslation()

  const { loading, transferInfo, executeTransfer } = useTransferContext()
  const {
    lng,
    identity,
    userConfig: {
      props: { currency }
    },
    converter: { pricesData, convertCurrency }
  } = useContext(LaWalletContext)

  const { balance } = useTokenBalance({
    pubkey: identity.hexpub,
    tokenId: 'BTC',
    closeOnEose: true
  })

  const convertedAmount: string = useMemo(() => {
    const convertedInt: number = convertCurrency(
      transferInfo.amount,
      'SAT',
      currency
    )

    return formatToPreference(currency, convertedInt, lng)
  }, [transferInfo.amount, pricesData, currency])

  const [transferUsername, transferDomain] = transferInfo.data.split('@')

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h6">{t('VALIDATE_INFO')}</Heading>
        </Flex>
      </Navbar>

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
                <Text>{transferUsername}</Text>
                <Text color={theme.colors.gray50}>@{transferDomain}</Text>
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
              {currency !== 'SAT' && <Text>$</Text>}
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
          transferInfo.amount > balance.amount && (
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
                  balance.amount < transferInfo.amount)
              }
            >
              {loading ? (
                <BtnLoader />
              ) : transferInfo.type === TransferTypes.LNURLW ? (
                t('CLAIM')
              ) : (
                t('TRANSFER')
              )}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
