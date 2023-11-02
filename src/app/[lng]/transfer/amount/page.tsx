'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled'
import { useRouter } from 'next/navigation'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import TokenList from '@/components/TokenList'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  LinkButton,
  Keyboard,
  Icon,
  Feedback
} from '@/components/UI'
import theme from '@/styles/theme'
import { LaWalletContext } from '@/context/LaWalletContext'
import { decimalsToUse, formatToPreference } from '@/lib/formatter'
import { useNumpad } from '@/hooks/useNumpad'
import { useTranslation } from '@/hooks/useTranslations'
import { useTransferContext } from '@/context/TransferContext'
import { BtnLoader } from '@/components/Loader/Loader'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import useErrors from '@/hooks/useErrors'
import { TransferTypes } from '@/types/transaction'

export default function Page() {
  const { t } = useTranslation()

  const [loading, setLoading] = useState<boolean>(false)
  const { transferInfo, setAmountToPay } = useTransferContext()
  const {
    identity,
    lng,
    userConfig: {
      props: { currency: userCurrency }
    },
    converter: { pricesData, convertCurrency }
  } = useContext(LaWalletContext)

  const { balance } = useTokenBalance({
    pubkey: identity.hexpub,
    tokenId: 'BTC'
  })

  const maxAvailableAmount: number = useMemo(() => {
    const convertedAmount: number = convertCurrency(
      balance.amount,
      'SAT',
      userCurrency
    )

    return convertedAmount
  }, [pricesData, balance.amount, userCurrency])

  const numpadData = useNumpad(userCurrency, maxAvailableAmount)
  const errors = useErrors()
  const router = useRouter()

  const handleClick = () => {
    if (loading) return
    if (!transferInfo.data) router.push('/transfer')

    setLoading(true)

    const satsAmount: number =
      numpadData.intAmount['SAT'] > balance.amount
        ? balance.amount
        : numpadData.intAmount['SAT']

    if (
      transferInfo.type === TransferTypes.LUD16 &&
      transferInfo.walletService
    ) {
      const mSats = satsAmount * 1000
      const { minSendable, maxSendable } = transferInfo.walletService

      if (mSats < minSendable! || mSats > maxSendable!) {
        errors.modifyError('INVALID_SENDABLE_AMOUNT', {
          minSendable: (minSendable! / 1000).toString(),
          maxSendable: (maxSendable! / 1000).toString(),
          currency: 'SAT'
        })

        setLoading(false)
        return
      }
    }

    setAmountToPay(satsAmount)
    router.push(`/transfer/summary?data=${transferInfo.data}`)
  }

  useEffect(() => {
    if (
      transferInfo.amount &&
      transferInfo.amount !== numpadData.intAmount['SAT']
    ) {
      const convertedAmount: number =
        convertCurrency(transferInfo.amount, 'SAT', userCurrency) *
        10 ** decimalsToUse(userCurrency)

      numpadData.updateNumpadAmount(convertedAmount.toString())
    }
  }, [pricesData])

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h6">{t('DEFINE_AMOUNT')}</Heading>
        </Flex>
      </Navbar>

      <Container size="small">
        <Divider y={16} />
        <Flex direction="column" gap={8} flex={1} justify="center">
          <Flex justify="center" align="center" gap={4}>
            {userCurrency === 'SAT' ? (
              <Icon size="small">
                <SatoshiV2Icon />
              </Icon>
            ) : (
              <Text>$</Text>
            )}
            <Heading>
              {formatToPreference(
                userCurrency,
                numpadData.intAmount[numpadData.usedCurrency],
                lng
              )}
            </Heading>
          </Flex>

          <Flex justify="center" align="center" gap={4}>
            <Heading as="h6" color={theme.colors.gray50}>
              {userCurrency !== 'SAT' && '$'}
              {formatToPreference(userCurrency, maxAvailableAmount, lng)}{' '}
              {t('AVAILABLE')}.
            </Heading>
          </Flex>
          <TokenList />

          {transferInfo.walletService && (
            <Flex justify="center">
              <Feedback show={true} status={'success'}>
                {t('SENDABLE_AMOUNT', {
                  minSendable: formatToPreference(
                    'SAT',
                    transferInfo.walletService.minSendable! / 1000,
                    lng
                  ),
                  maxSendable: formatToPreference(
                    'SAT',
                    transferInfo.walletService.maxSendable! / 1000,
                    lng
                  )
                })}
              </Feedback>
            </Flex>
          )}
        </Flex>

        <Feedback show={errors.errorInfo.visible} status={'error'}>
          {errors.errorInfo.text}
        </Feedback>

        <Divider y={24} />
        <Flex gap={8}>
          <LinkButton variant="bezeledGray" href="/dashboard">
            {t('CANCEL')}
          </LinkButton>

          <Button
            onClick={handleClick}
            disabled={
              loading ||
              balance.amount === 0 ||
              numpadData.intAmount['SAT'] === 0
            }
          >
            {loading ? <BtnLoader /> : t('CONTINUE')}
          </Button>
        </Flex>
        <Divider y={24} />

        <Keyboard numpadData={numpadData} />

        <Divider y={32} />
      </Container>
    </>
  )
}
