import React from 'react'

import { Flex, Heading, Divider, Text } from '@/components/UI'
import Animations from '@/components/Animations'
import Wifi from '@/components/Animations/wifi.json'
import Container from '@/components/Layout/Container'

const CashDeposit = () => {
  return (
    <Container size="small">
      <Flex direction="column" justify="center" align="center" flex={1}>
        <Animations data={Wifi} />
        <Heading as="h4">¿Tenés solo efectivo?</Heading>
        <Divider y={4} />
        <Text size="small" align="center">
          ¡No hay problema! Acercate a nuestro stand que vamos a ayudarte a
          cargar tu billetera.
        </Text>
      </Flex>
    </Container>
  )
}

export default CashDeposit
