'use client'

import Navbar from '@/components/Layout/Navbar'
import { Flex, Heading } from '@/components/UI'
import { useTranslation } from '@/hooks/useTranslations'
import LightningDeposit from './components/LightningDeposit'

export default function Page() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('DEPOSIT')}</Heading>
        </Flex>
      </Navbar>

      <LightningDeposit />
    </>
  )
}
