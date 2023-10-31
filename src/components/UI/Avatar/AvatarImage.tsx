'use client'

import { AvatarImage } from './style'

interface ComponentProps {
  src: string
  alt: string
}

export default function Component(props: ComponentProps) {
  const { src, alt } = props

  return <AvatarImage src={src} alt={alt} />
}
