'use client'

import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import { Button, Divider, Flex, Text } from '@/components/UI'
import { useTranslation } from '@/hooks/useTranslations'

import theme from '@/styles/theme'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()

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
          <Button
            onClick={() =>
              router.push(`/start?i=${params.get('i')}&c=${params.get('c')}`)
            }
          >
            {t('START')}
          </Button>
        </Flex>
      </Flex>
      <Divider y={32} />
    </Container>
  )
}
