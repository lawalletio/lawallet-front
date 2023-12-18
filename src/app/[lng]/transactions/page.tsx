'use client'

import Container from '@/components/Layout/Container'
import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import TransactionItem from '@/components/TransactionItem'
import { Button, Divider, Flex } from '@/components/UI'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { t } = useTranslation()
  const { userTransactions } = useLaWalletContext()
  const router = useRouter()

  return (
    <>
      <Navbar showBackPage={true} title={t('ACTIVITY')} />

      <Container size="small">
        {/* <Divider y={12} /> */}
        {/* <Text size="small" color={theme.colors.gray50}>
          {t('TODAY')}
        </Text> */}
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          {userTransactions.map(transaction => (
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
