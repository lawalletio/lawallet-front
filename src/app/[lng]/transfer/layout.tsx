'use client'
import { TransferProvider } from '@/context/TransferContext'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Transferir - LaWallet'
// }

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <TransferProvider tokenName={'BTC'}>{children}</TransferProvider>
}
