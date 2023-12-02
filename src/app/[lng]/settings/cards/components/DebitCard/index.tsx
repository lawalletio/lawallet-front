import { GearIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Card from '@/components/Card'

import { CardImage, ConfigCard } from './style'
import { useState } from 'react'
import { Flex, Button } from '@/components/UI'

import Pause from '@/components/Icons/Pause'
import Play from '@/components/Icons/Play'

interface ComponentProps {
  card: any
  active: boolean
}

export default function Component(props: ComponentProps) {
  const { card, active } = props

  const [handleSelected, setHandleSelected] = useState(false)

  return (
    <Flex
      justify={`${handleSelected ? 'end' : 'center'}`}
      align="center"
      gap={8}
    >
      <CardImage
        onClick={() => setHandleSelected(!handleSelected)}
        $isActive={handleSelected}
      >
        <Card card={card} active={active} />
      </CardImage>
      <ConfigCard $isActive={handleSelected}>
        <Flex direction="column" flex={1} justify="center" gap={8}>
          {active ? (
            <div>
              <Button onClick={() => null} color="secondary" variant="bezeled">
                <Pause />
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={() => null} variant="bezeled">
                <Play />
              </Button>
            </div>
          )}
          {/* <div>
            <Button onClick={() => null} variant="bezeledGray">
              <GearIcon />
            </Button>
          </div> */}
        </Flex>
      </ConfigCard>
    </Flex>
  )
}
