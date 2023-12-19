import { ReactNode } from 'react'

import { Default } from './style'
import { Divider } from '@/components/UI'

interface ButtonCTAProps {
  children: ReactNode
}

export default function ButtonCTA(props: ButtonCTAProps) {
  const { children } = props

  return (
    <Default>
      <Divider y={12} />
      <div>{children}</div>
      <Divider y={24} />
    </Default>
  )
}
