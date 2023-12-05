import { ArrowRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Flex from '../Flex'
import Heading from '../Heading'
import Text from '../Text'
import Icon from '../Icon'

import theme from '@/styles/theme'
import { BannerAlert as Default, Asset } from './style'

import Security from './Background/Security'
import Voucher from './Background/Voucher'

interface ComponentProps {
  title: string
  description: string
  href?: string
  color?: 'success' | 'warning' | 'error'
}

export default function BannerAlert(props: ComponentProps) {
  const { title, description, color = 'success' } = props

  return (
    <Default $color={theme.colors[color]}>
      <div>
        <Flex direction="column" gap={4}>
          <Heading as="h6">{title}</Heading>
          <Text>{description}</Text>
        </Flex>
        <Icon color={theme.colors[color]}>
          <ArrowRightIcon />
        </Icon>
      </div>
      <Asset>
        {/* {color === 'success' && ()} */}
        {color === 'warning' && <Voucher />}
        {color === 'error' && <Security />}
      </Asset>
    </Default>
  )
}
