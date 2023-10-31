'use client'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { Divider, Flex, Heading, LinkButton, Text } from '@/components/UI'
import { useTransferContext } from '@/context/TransferContext'
import { useTranslation } from '@/hooks/useTranslations'

import { useRouter } from 'next/navigation'

export default function Page() {
  const { t } = useTranslation()
  const { transferInfo } = useTransferContext()

  const router = useRouter()
  if (!transferInfo.data) router.push('/dashboard')

  return (
    <>
      <Navbar />

      <Container size="small">
        <Divider y={16} />
        <Heading>Error</Heading>
        <Divider y={4} />
        <Text size="small">{t('DETAIL_FAILED_TRANSACTION')}</Text>
      </Container>

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <LinkButton variant="borderless" href="/dashboard">
              {t('GO_HOME')}
            </LinkButton>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
