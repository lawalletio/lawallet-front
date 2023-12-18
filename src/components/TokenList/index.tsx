'use client'

import Container from '@/components/Layout/Container'
import { Button, Flex } from '@/components/UI'

import { useLaWalletContext } from '@/context/LaWalletContext'
import { CurrenciesList } from '@/types/config'
import { TokenList } from './style'

export default function Component() {
  const { configuration } = useLaWalletContext()

  return (
    <TokenList>
      <Container>
        <Flex gap={4} justify="center">
          {CurrenciesList.map(currency => {
            const selected: boolean = configuration.props.currency === currency

            return (
              <Button
                key={currency}
                variant={selected ? 'bezeled' : 'borderless'}
                size="small"
                onClick={() => configuration.changeCurrency(currency)}
              >
                {currency}
              </Button>
            )
          })}
        </Flex>
      </Container>
    </TokenList>
  )
}
