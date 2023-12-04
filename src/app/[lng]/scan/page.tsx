'use client'

import Navbar from '@/components/Layout/Navbar'
import { Flex, Heading } from '@/components/UI'
import QrScanner from '@/components/UI/Scanner/Scanner'
import { useTranslation } from '@/hooks/useTranslations'
import { detectTransferType, removeLightningStandard } from '@/lib/utils'
import { TransferTypes } from '@/types/transaction'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()

  const handleScan = (result: any) => {
    if (!result || !result.data) return

    const cleanScan: string = removeLightningStandard(result.data)
    const scanType: boolean | string = detectTransferType(cleanScan)
    if (!scanType) return

    if (scanType === TransferTypes.INVOICE) {
      router.push(`/transfer/summary?data=${result.data.toLowerCase()}`)
      return
    }

    router.push(`/transfer/amount?data=${result.data.toLowerCase()}`)
  }

  useEffect(() => {
    router.prefetch('/transfer/summary')
    router.prefetch('/transfer/amount')
  }, [router])

  return (
    <>
      <Navbar showBackPage={true} title={t('SCAN_QR')} />

      <Flex justify="center" align="center" flex={1}>
        <QrScanner
          onDecode={handleScan}
          startOnLaunch={true}
          highlightScanRegion={true}
          highlightCodeOutline={true}
          constraints={{ facingMode: 'environment' }}
          preferredCamera={'environment'}
        />
      </Flex>
    </>
  )
}
