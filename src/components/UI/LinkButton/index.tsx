'use client'

import theme from '@/styles/theme'
import { LinkButton } from './style'
import { ReactNode } from 'react'

type Color = 'primary' | 'secondary' | 'error'
type Variant = 'filled' | 'bezeled' | 'bezeledGray' | 'borderless'
type Size = 'small' | 'normal'

interface ComponentProps {
  children: ReactNode
  color?: Color
  variant?: Variant
  size?: Size
  // disabled?: boolean;
  componentName?: string
  tabIndex?: number
  href: string
}

function variantsList(variant: Variant, color: Color) {
  const list = {
    filled: {
      background: theme.colors[color],
      color: theme.colors.black
    },
    bezeled: {
      background: theme.colors[`${color}15`],
      color: theme.colors[color]
    },
    bezeledGray: {
      background: theme.colors.gray15,
      color: theme.colors[color]
    },
    borderless: {
      background: theme.colors.transparent,
      color: theme.colors[color]
    }
  }

  return list[variant]
}

export default function Component(props: ComponentProps) {
  const {
    children,
    color = 'primary',
    variant = 'filled',
    size = 'normal',
    // disabled = false,
    tabIndex = 0,
    href
  } = props

  return (
    <LinkButton
      href={href}
      tabIndex={tabIndex}
      // disabled={disabled}
      $isSmall={size === 'small'}
      $background={variantsList(variant, color)?.background}
      $color={variantsList(variant, color)?.color}
    >
      {children}
    </LinkButton>
  )
}
