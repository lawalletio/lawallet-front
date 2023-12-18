/* eslint-disable @next/next/no-img-element */
'use client'

import {
  GearIcon,
  HiddenIcon,
  QrCodeIcon,
  ReceiveIcon,
  SatoshiV2Icon,
  SendIcon,
  VisibleIcon
} from '@bitcoin-design/bitcoin-icons-react/filled'
import { useEffect, useMemo, useState } from 'react'

import HeroCard from '@/components/HeroCard'
import Container from '@/components/Layout/Container'
import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import TokenList from '@/components/TokenList'
import TransactionItem from '@/components/TransactionItem'
import {
  Avatar,
  BannerAlert,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Text
} from '@/components/UI'

import { useLaWalletContext } from '@/context/LaWalletContext'
import theme from '@/styles/theme'

// Harcode data
import config from '@/constants/config'
import { useTranslation } from '@/context/TranslateContext'
import { formatToPreference } from '@/lib/utils/formatter'
import { useRouter } from 'next/navigation'

// Animations
import Animations from '@/components/Animations'
import BitcoinTrade from '@/components/Animations/bitcoin-trade.json'
import { BtnLoader } from '@/components/Loader/Loader'
import { CACHE_BACKUP_KEY } from '@/constants/constants'
import { copy } from '@/lib/utils/share'
import Link from 'next/link'

export default function Page() {
  const { t, lng } = useTranslation()
  const [showBanner, setShowBanner] = useState<'backup' | 'none'>('none')

  const router = useRouter()
  const {
    identity,
    balance,
    sortedTransactions,
    userConfig: {
      loading,
      toggleHideBalance,
      props: { hideBalance, currency }
    },
    converter: { pricesData, convertCurrency }
  } = useLaWalletContext()

  const convertedBalance: string = useMemo(() => {
    const amount: number = convertCurrency(balance.amount, 'SAT', currency)
    return formatToPreference(currency, amount, lng)
  }, [balance, pricesData, currency])

  useEffect(() => {
    router.prefetch('/deposit')
    router.prefetch('/transfer')
    router.prefetch('/settings')
    router.prefetch('/scan')
  }, [router])

  useEffect(() => {
    const userMadeBackup: boolean = Boolean(
      localStorage.getItem(`${CACHE_BACKUP_KEY}_${identity.hexpub}`) || false
    )

    setShowBanner(!userMadeBackup ? 'backup' : 'none')
  }, [])

  return (
    <>
      <HeroCard>
        <Navbar>
          <Flex align="center" gap={8}>
            <Avatar>
              <Text size="small">
                {identity.username
                  ? identity.username.substring(0, 2).toUpperCase()
                  : 'AN'}
              </Text>
            </Avatar>
            <Flex direction="column">
              <Text size="small" color={theme.colors.gray50}>
                {t('HELLO')},
              </Text>
              <Flex
                onClick={() => {
                  if (identity.username)
                    copy(`${identity.username}@${config.env.WALLET_DOMAIN}`)
                }}
              >
                {loading ? (
                  <Text> -- </Text>
                ) : (
                  <Text>
                    {identity.username
                      ? `${identity.username}@${config.env.WALLET_DOMAIN}`
                      : t('ANONYMOUS')}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex gap={4} justify="end">
            <Button variant="bezeled" size="small" onClick={toggleHideBalance}>
              <Icon size="small">
                {hideBalance ? <HiddenIcon /> : <VisibleIcon />}
              </Icon>
            </Button>
            <Button
              variant="bezeled"
              size="small"
              onClick={() => router.push('/settings')}
            >
              <Icon size="small">
                <GearIcon />
              </Icon>
            </Button>
          </Flex>
        </Navbar>

        <Flex direction="column" align="center" justify="center" flex={1}>
          <Text size="small" color={theme.colors.gray50}>
            {t('BALANCE')}
          </Text>
          <Divider y={8} />
          <Flex justify="center" align="center" gap={4}>
            <Flex justify="center" align="center" gap={4}>
              {currency === 'SAT' ? (
                <Icon size="small">
                  <SatoshiV2Icon />
                </Icon>
              ) : (
                <Text>$</Text>
              )}

              <Heading>
                {loading || balance.loading ? (
                  <BtnLoader />
                ) : hideBalance ? (
                  '*****'
                ) : (
                  convertedBalance
                )}
              </Heading>
            </Flex>
          </Flex>
          <Divider y={8} />

          {!loading && <TokenList />}
        </Flex>
      </HeroCard>

      <Container size="small">
        <Divider y={16} />
        <Flex gap={8}>
          <Button onClick={() => router.push('/deposit')}>
            <Icon>
              <ReceiveIcon />
            </Icon>
            {t('DEPOSIT')}
          </Button>

          <Button onClick={() => router.push('/transfer')} color="secondary">
            <Icon>
              <SendIcon />
            </Icon>
            {t('TRANSFER')}
          </Button>
        </Flex>
        <Divider y={16} />

        {showBanner === 'backup' ? (
          <>
            <Link href="/settings/recovery">
              <BannerAlert
                title={t('RECOMMEND_BACKUP')}
                description={t('RECOMMEND_BACKUP_REASON')}
                color="error"
              />
            </Link>
            <Divider y={16} />
          </>
        ) : null}

        {sortedTransactions.length === 0 ? (
          <Flex direction="column" justify="center" align="center" flex={1}>
            <Animations data={BitcoinTrade} />
            <Heading as="h4">{t('EMPTY_TRANSACTIONS_TITLE')}</Heading>
            <Divider y={4} />
            <Text size="small">{t('EMPTY_TRANSACTIONS_DESC')}</Text>
          </Flex>
        ) : (
          <>
            <Flex justify="space-between" align="center">
              <Text size="small" color={theme.colors.gray50}>
                {t('LAST_ACTIVITY').toUpperCase()}
              </Text>

              <Button
                size="small"
                variant="borderless"
                onClick={() => router.push('/transactions')}
              >
                {t('SEE_ALL')}
              </Button>
            </Flex>

            <Flex direction="column" gap={4}>
              {sortedTransactions.slice(0, 5).map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </Flex>
          </>
        )}
        <Divider y={64} />
      </Container>

      <Footer>
        <Flex justify="center">
          <div>
            <Button color="secondary" onClick={() => router.push('/scan')}>
              <Icon>
                <QrCodeIcon />
              </Icon>
            </Button>
          </div>
        </Flex>
      </Footer>
    </>
  )
}
