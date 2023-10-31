/* eslint-disable @next/next/no-img-element */
'use client'

import theme from '@/styles/theme'

import Bitcoin from '../../Icons/Bitcoin'
import Text from '../Text'
import Flex from '../Flex'
import Icon from '../Icon'

import { formatBigNumber } from '@/lib/utils'

interface ComponentProps {
  item:
    | any
    | { symbol: string; label: string; amount: number; priceArs: number }
  showPrice?: boolean
}

export default function InfoToken(props: ComponentProps) {
  const { item, showPrice = false } = props

  if (!item) return null

  const { symbol, label, amount = 0, priceArs = 0 } = item

  return (
    <>
      <Flex flex={1} gap={8} align="center">
        {/* POC: reeplace ICONS for vectors */}
        <Icon>
          {symbol === 'sats' && <Bitcoin />}
          {symbol === 'pnt' && (
            <img alt="PintToken" src="/tokens/PintaToken.png" />
          )}
        </Icon>
        <Flex direction="column">
          <Text>{symbol?.toLocaleUpperCase()}</Text>
          <Text size="small" color={theme.colors.gray50}>
            {label}
          </Text>
        </Flex>
      </Flex>
      {showPrice && (
        <Flex direction="column" justify="end" align="end">
          <Flex gap={4} justify="end" align="center">
            <Text isBold>{formatBigNumber(amount)}</Text>
            <Text size="small">{symbol?.toLocaleUpperCase()}</Text>
          </Flex>
          <Flex gap={4} justify="end">
            <Text size="small" color={theme.colors.gray50}>
              {formatBigNumber(amount * priceArs)}
            </Text>
            <Text size="small" color={theme.colors.gray50}>
              ARS
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  )
}
