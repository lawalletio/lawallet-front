'use client'

import Container from '@/components/Layout/Container'
import { Flex, Button } from '@/components/UI'

import { TokenList } from './style'
import { LaWalletContext } from '@/context/LaWalletContext'
import { useContext } from 'react'
import { CurrenciesList } from '@/types/config'

export default function Component() {
  const { userConfig } = useContext(LaWalletContext)

  return (
    <TokenList>
      <Container>
        <Flex gap={4} justify="center">
          {CurrenciesList.map(currency => {
            const selected: boolean = userConfig.props.currency === currency

            return (
              <Button
                key={currency}
                variant={selected ? 'bezeled' : 'borderless'}
                size="small"
                onClick={() => userConfig.changeCurrency(currency)}
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
