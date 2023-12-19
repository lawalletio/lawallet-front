import { ReactNode } from 'react'
import { ButtonSetting } from './style'

interface ComponentProps {
  children: ReactNode
  onClick: () => void
}

export default function Component(props: ComponentProps) {
  const { children, onClick } = props

  return <ButtonSetting onClick={onClick}>{children}</ButtonSetting>
}
