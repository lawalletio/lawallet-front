'use client'

import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import { Button, Divider, Flex, Text } from '@/components/UI'
import { useTranslation } from '@/hooks/useTranslations'

import theme from '@/styles/theme'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/login')
  }, [router])

  return (
    <Container size="small">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={theme.colors.gray50}>
          v1.0.0
        </Text>
      </Flex>

      <Flex direction="column">
        <Divider y={16} />

        <Flex>
          <Button onClick={() => router.push('/login')}>
            {t('LOGIN_ACCOUNT')}
          </Button>
        </Flex>
      </Flex>
      <Divider y={32} />
    </Container>
  )
}
