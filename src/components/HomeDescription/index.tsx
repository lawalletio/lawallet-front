'use client'

import { useTranslation } from '@/hooks/useTranslations'
import { Flex, Heading, Text } from '../UI'

import theme from '@/styles/theme'

import { HomeDescription } from './style'

export default function Component({ hasNonce }: { hasNonce: boolean }) {
  const { t } = useTranslation()

  return (
    <HomeDescription>
      <Flex direction="column" align="center" gap={8}>
        <Text align="center">
          {hasNonce ? t('CONFIGURE_CARD') : t('CREATE_NEW_ACCOUNT')}
        </Text>
        <Heading align="center" color={theme.colors.primary}>
          {hasNonce
            ? t('CONFIGURE_CARD_SECONDS')
            : t('CONFIGURE_ACCOUNT_SECONDS')}
        </Heading>
      </Flex>
    </HomeDescription>
  )
}
