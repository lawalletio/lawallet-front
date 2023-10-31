'use client'

import { ReactNode } from 'react'
import { HeroCard } from './style'

interface HeroCardProps {
  children: ReactNode
}

export default function Component(props: HeroCardProps) {
  const { children } = props

  return <HeroCard>{children}</HeroCard>
}
