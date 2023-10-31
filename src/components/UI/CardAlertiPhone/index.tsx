import Heading from '../Heading'
import Text from '../Text'
import Flex from '../Flex'
import SafariLogo from '../SafariLogo'

import { CardAlertiPhone } from './style'

export default function Component() {
  return (
    <CardAlertiPhone>
      <Flex direction="column" gap={4}>
        <Heading as="h6">Usuario de iPhone</Heading>
        <Text>
          <strong>Recomendamos utilizar Safari</strong> para un mejor manejo de
          la aplicacion.
        </Text>
      </Flex>
      <div>
        <SafariLogo />
      </div>
    </CardAlertiPhone>
  )
}
