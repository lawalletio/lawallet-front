'use client'

import { useState } from 'react'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { Button, ButtonGroup, Flex, Heading } from '@/components/UI'
import { useTranslation } from '@/hooks/useTranslations'
import LightningDeposit from './components/LightningDeposit'
import CashDeposit from './components/CashDeposit'

export default function Page() {
  const { t } = useTranslation()
  const [viewLightning, setViewLightning] = useState<boolean>(true)

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('DEPOSIT')}</Heading>
        </Flex>
      </Navbar>

      <Container>
        <ButtonGroup>
          <Button
            onClick={() => setViewLightning(true)}
            size="small"
            variant={viewLightning ? 'bezeled' : 'borderless'}
          >
            Lightning
          </Button>
          <Button
            onClick={() => setViewLightning(false)}
            size="small"
            variant={viewLightning ? 'borderless' : 'bezeled'}
          >
            Efectivo
          </Button>
        </ButtonGroup>
      </Container>

      {viewLightning ? <LightningDeposit /> : <CashDeposit />}
    </>
  )
}
