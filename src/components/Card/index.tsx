import Image from 'next/image'

import { Card } from './style'

interface ComponentProps {
  card: any
  active: boolean
}

export default function Component(props: ComponentProps) {
  const { card, active } = props

  return (
    <Card $isActive={active}>
      {/* <Image
        src={`/images/${card.image}.png`}
        alt={card.name}
        width={280}
        height={176}
      /> */}
    </Card>
  )
}
