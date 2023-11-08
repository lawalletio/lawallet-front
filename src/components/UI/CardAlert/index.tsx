import Heading from '../Heading'
import Text from '../Text'
import Flex from '../Flex'
import SafariLogo from '../SafariLogo'

import { CardAlertiPhone } from './style'
import { ReactNode } from 'react'
import { CaretRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

export default function Component({
  title,
  description,
  isHome = true
}: {
  title: string
  description: ReactNode
  isHome?: boolean
}) {
  return (
    <CardAlertiPhone>
      <Flex direction="column" gap={4}>
        <Heading as="h6">{title}</Heading>
        <Text>{description}</Text>
      </Flex>
      <div>{isHome ? <SafariLogo /> : <CaretRightIcon />}</div>
    </CardAlertiPhone>
  )
}
