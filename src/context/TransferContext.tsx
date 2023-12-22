import useTransfer, { TransferContextType } from '@/hooks/useTransfer'
import { createContext, useContext } from 'react'

export const TransferContext = createContext({} as TransferContextType)

export function TransferProvider({
  children,
  tokenName
}: {
  children: React.ReactNode
  tokenName: string
}) {
  const transferValue = useTransfer({ tokenName })

  return (
    <TransferContext.Provider value={transferValue}>
      {children}
    </TransferContext.Provider>
  )
}

export const useTransferContext = () => {
  return useContext(TransferContext)
}
