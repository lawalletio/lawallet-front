'use client'

import { DividerCustom } from './style'

interface DividerProps {
  x?: number
  y?: number
}

export default function Divider(props: DividerProps) {
  const { x = 0, y = 0 } = props

  return <DividerCustom $y={y} $x={x} />
}
