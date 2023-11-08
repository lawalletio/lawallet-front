import React from 'react'

import { Flex, Heading, Divider, Text } from '@/components/UI'
import Animations from '@/components/Animations'
import SadFace from '@/components/Animations/sad-face.json'
import Container from '@/components/Layout/Container'

const CashDeposit = () => {
  return (
    <Container size="small">
      <Flex direction="column" justify="center" align="center" flex={1}>
        <Animations data={SadFace} />
        <Divider y={16} />
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
