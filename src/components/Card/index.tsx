import Image from 'next/image'

import { Card } from './style'
import { Design } from '@/types/card'

interface ComponentProps {
  data: { design: Design }
  active: boolean
}

export default function Component(props: ComponentProps) {
  const { data, active } = props

  return (
    <Card $isActive={active}>
      <Image
        src={`/cards/${data.design.uuid}.png`}
        alt={data.design.uuid}
        width={280}
        height={176}
      />
    </Card>
  )
}
