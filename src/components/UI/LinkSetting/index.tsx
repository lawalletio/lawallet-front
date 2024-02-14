import Link from 'next/link'
import { CaretRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Icon from '../Icon'

import theme from '@/styles/theme'
import { LinkSetting } from './style'
import { ReactNode } from 'react'

interface ComponentProps {
  children: ReactNode
  href: string
  target?: '_self' | '_blank'
}

export default function Component(props: ComponentProps) {
  const { children, href, target } = props

  return (
    <LinkSetting>
      <Link href={href} target={target}>
        {children}
        <Icon size="small" color={theme.colors.gray40}>
          <CaretRightIcon />
        </Icon>
      </Link>
    </LinkSetting>
  )
}
