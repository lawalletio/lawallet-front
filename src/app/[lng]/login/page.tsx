'use client'

import { useRouter } from 'next/navigation'

import { useTranslation } from '@/hooks/useTranslations'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { BtnLoader } from '@/components/Loader/Loader'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Textarea,
  Feedback
} from '@/components/UI'

export default function Page() {
  const router = useRouter()
  const { t } = useTranslation()

  const handleChange = e => {
    console.log('e', e.target.value)
  }

  return (
    <>
      <Navbar />
      <Container size="small">
        <Flex direction="column" justify="center">
          <Heading as="h2">Inicia sesion</Heading>

          <Divider y={8} />
          <Textarea
            placeholder="Ingresa tu clave privada"
            onChange={handleChange}
          />
        </Flex>
      </Container>
      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button variant="bezeledGray" onClick={() => router.push('/')}>
              {t('CANCEL')}
            </Button>
            <Button onClick={() => null} disabled={true}>
              Ingresar
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
