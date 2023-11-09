'use client'

import { SatoshiV2Icon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Confetti,
  Divider,
  Flex,
  Heading,
  Icon,
  LinkButton,
  Text
} from '@/components/UI'
import { useTranslation } from '@/hooks/useTranslations'

import theme from '@/styles/theme'

export default function Page() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar />

      <Container size="small">
        <Confetti />
        <Divider y={16} />
        <Heading>{t('FINISH_TRANSFER_TITLE')}</Heading>
        <Divider y={4} />
        <Text size="small">{t('VOUCHER_SUCCESS_DESC')}</Text>
        <Divider y={24} />

        <Flex align="center" justify="center" gap={4}>
          <Icon size="small">
            <SatoshiV2Icon />
          </Icon>
          <Heading>1000</Heading>
          <Text>SAT</Text>
        </Flex>

        <Divider y={24} />

        <Text size="small" align="center" color={theme.colors.gray50}>
          {t('VOUCHER_CARD_INFO')}
        </Text>
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
