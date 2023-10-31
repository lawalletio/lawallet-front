'use client'

import Navbar from '@/components/Layout/Navbar'
import { Flex, Heading } from '@/components/UI'
import QrScanner from '@/components/UI/Scanner/Scanner'
import { useTranslation } from '@/hooks/useTranslations'
import { TransferInformation } from '@/interceptors/transaction'
import { formatTransferData } from '@/lib/utils'
import { TransferTypes } from '@/types/transaction'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()

  const handleScan = (result: any) => {
    if (!result || !result.data) return

    formatTransferData(result.data).then(
      (formattedTransfer: TransferInformation) => {
        if (!formattedTransfer.data) return

        if (formattedTransfer.type === TransferTypes.INVOICE) {
          router.push(`/transfer/summary?data=${formattedTransfer.data}`)
          return
        }

        router.push(`/transfer/amount?data=${formattedTransfer.data}`)
      }
    )
  }

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('SCAN_QR')}</Heading>
        </Flex>
      </Navbar>

      <Flex justify="center" align="center" flex={1}>
        <QrScanner
          maxScansPerSecond={3}
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
