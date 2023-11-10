import React from 'react'

import { Flex, Heading, Divider, Text } from '@/components/UI'
import Animations from '@/components/Animations'
import SadFace from '@/components/Animations/sad-face.json'
import Container from '@/components/Layout/Container'
import { useTranslation } from '@/hooks/useTranslations'

const CashDeposit = () => {
  const { t } = useTranslation()
  return (
    <Container size="small">
      <Flex direction="column" justify="center" align="center" flex={1}>
        <Animations data={SadFace} />
        <Divider y={16} />
        <Heading as="h4">{t('ONLY_CASH')}</Heading>
        <Divider y={4} />
        <Text size="small" align="center">
          {t('GO_TO_STAND')}
        </Text>
      </Flex>
    </Container>
  )
}

export default CashDeposit
