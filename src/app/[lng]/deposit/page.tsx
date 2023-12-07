'use client'

import Navbar from '@/components/Layout/Navbar'
import { useTranslation } from '@/hooks/useTranslations'
import LightningDeposit from './components/LightningDeposit'

export default function Page() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar showBackPage={true} title={t('DEPOSIT')} />

      <LightningDeposit />
    </>
  )
}
