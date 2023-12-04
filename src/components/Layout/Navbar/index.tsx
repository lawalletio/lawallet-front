'use client'

import { useRouter } from 'next/navigation'
import { CaretLeftIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import { Flex, Icon, Heading } from '@/components/UI'
import Container from '../Container'

import { Navbar, BackButton, Left, Right } from './style'
import { ReactNode } from 'react'

interface ComponentProps {
  children?: ReactNode
  showBackPage?: boolean
  title?: string
}

export default function Component(props: ComponentProps) {
  const { children, showBackPage = false, title } = props

  const router = useRouter()

  const onlyChildren = !!!children

  return (
    <Navbar>
      <Container>
        <Flex flex={1} align="center" gap={8}>
          {onlyChildren && (
            <Left>
              {showBackPage && (
                <BackButton onClick={() => router.back()}>
                  <Icon size="small">
                    <CaretLeftIcon />
                  </Icon>
                  Volver
                </BackButton>
              )}
            </Left>
          )}
          {title ? (
            <Flex justify="center">
              <Heading as="h5">{title}</Heading>
            </Flex>
          ) : (
            children
          )}
          {onlyChildren && <Right></Right>}
        </Flex>
      </Container>
    </Navbar>
  )
}
