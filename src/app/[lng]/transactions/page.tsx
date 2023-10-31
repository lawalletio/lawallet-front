'use client'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import Footer from '@/components/Layout/Footer'
import TransactionItem from '@/components/TransactionItem'
import { Divider, Flex, Heading, Button } from '@/components/UI'
import { useTranslation } from '@/hooks/useTranslations'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { LaWalletContext } from '@/context/LaWalletContext'

export default function Page() {
  const { t } = useTranslation()
  const { transactions } = useContext(LaWalletContext)
  const router = useRouter()

  return (
    <>
      <Navbar>
        <Flex align="center">
          <Heading as="h5">{t('LAST_ACTIVITY')}</Heading>
        </Flex>
      </Navbar>

      <Container size="small">
        {/* <Divider y={12} /> */}
        {/* <Text size="small" color={theme.colors.gray50}>
          {t('TODAY')}
        </Text> */}
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          {transactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </Flex>
        {/* <Divider y={12} />
        <Text size="small" color={theme.colors.gray50}>
          {t('YESTERDAY')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          {transactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </Flex>
        <Divider y={12} /> */}
      </Container>

      <Divider y={64} />

      <Footer>
        <Button variant="bezeledGray" onClick={() => router.push('/dashboard')}>
          {t('CANCEL')}
        </Button>
      </Footer>
    </>
  )
}
