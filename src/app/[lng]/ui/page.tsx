/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'

import {
  faQrcode,
  faFingerprint,
  faDeleteLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import theme from '@/styles/theme'

import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'

import {
  Button,
  Combobox,
  Divider,
  Flex,
  Feedback,
  InputGroup,
  InputGroupRight,
  InputWithLabel,
  Heading,
  Input,
  QRCode,
  Text,
  Accordion,
  AccordionBody,
  Avatar,
  AvatarImage,
  DotStatus
} from '@/components/UI'

export default function Home() {
  // Input feedback
  const inputStatusSuccess = 'success'
  const inputStatusError = 'error'

  // Combobox
  const [tokenSelected, setTokenSelected] = useState(0)
  const listTokens = [
    {
      id: 1,
      label: 'Bitcoin',
      symbol: 'sats',
      amount: 1250000,
      priceArs: 0.1259
    },
    { id: 2, label: 'PintaToken', symbol: 'pnt', amount: 3, priceArs: 700 }
  ]

  return (
    <Container size="small">
      <Divider y={32} />
      <Logo />
      <Divider y={32} />
      <Flex direction="column" gap={8}>
        <Heading>Lorem ipsum dolor sit amet.</Heading>
        <Heading as="h2">Lorem ipsum dolor sit amet.</Heading>
        <Heading as="h3">Lorem ipsum dolor sit amet.</Heading>
        <Heading as="h4">Lorem ipsum dolor sit amet.</Heading>
        <Heading as="h5">Lorem ipsum dolor sit amet.</Heading>
        <Heading as="h6">Lorem ipsum dolor sit amet.</Heading>
      </Flex>
      <Divider y={32} />
      <Flex direction="column" gap={8}>
        <Text>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus
          nostrum alias blanditiis expedita voluptate dignissimos, harum
          accusamus soluta, placeat architecto repellat tempore quaerat
          voluptatem quis assumenda. Deserunt pariatur perspiciatis ab?
        </Text>
        <Text size="small">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus
          nostrum alias blanditiis expedita voluptate dignissimos, harum
          accusamus soluta, placeat architecto repellat tempore quaerat
          voluptatem quis assumenda. Deserunt pariatur perspiciatis ab?
        </Text>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <Button size="small" onClick={() => alert('hola')}>
          Button
        </Button>
        <Button size="small" variant="bezeled" onClick={() => alert('hola')}>
          Button
        </Button>
        <Button
          size="small"
          variant="bezeledGray"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
        <Button size="small" variant="borderless" onClick={() => alert('hola')}>
          Button
        </Button>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <Button size="small" color="secondary" onClick={() => alert('hola')}>
          Button
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="bezeled"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="bezeledGray"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="borderless"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <Button onClick={() => alert('hola')}>Button</Button>
        <Button variant="bezeled" onClick={() => alert('hola')}>
          Button
        </Button>
        <Button variant="bezeledGray" onClick={() => alert('hola')}>
          Button
        </Button>
        <Button variant="borderless" onClick={() => alert('hola')}>
          Button
        </Button>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <Button color="secondary" onClick={() => alert('hola')}>
          Button
        </Button>
        <Button
          color="secondary"
          variant="bezeled"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
        <Button
          color="secondary"
          variant="bezeledGray"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
        <Button
          color="secondary"
          variant="borderless"
          onClick={() => alert('hola')}
        >
          Button
        </Button>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <div>
          <Button
            color="primary"
            variant="bezeled"
            onClick={() => alert('hola')}
          >
            <FontAwesomeIcon icon={faFingerprint} />
          </Button>
        </div>
        <div>
          <Button
            color="secondary"
            variant="bezeled"
            onClick={() => alert('hola')}
          >
            <FontAwesomeIcon icon={faQrcode} />
          </Button>
        </div>
        <div>
          <Button color="error" variant="bezeled" onClick={() => alert('hola')}>
            <FontAwesomeIcon icon={faDeleteLeft} />
          </Button>
        </div>
      </Flex>
      <Divider y={32} />
      <>
        <Input placeholder="Input" type="text" />
        <Feedback show={false}>0/6 characters</Feedback>
      </>
      <>
        <Input placeholder="Input" type="text" isLoading={true} />
      </>
      <Divider y={32} />
      <>
        <Input
          placeholder="Input"
          type="text"
          status={inputStatusSuccess}
          isChecked={true}
        />
        <Feedback show={!!inputStatusSuccess} status={inputStatusSuccess}>
          0/6 characters
        </Feedback>
      </>
      <Divider y={32} />
      <>
        <Input placeholder="Input" type="text" status={inputStatusSuccess} />
        <Feedback show={!!inputStatusSuccess} status={inputStatusSuccess}>
          0/6 characters
        </Feedback>
      </>
      <Divider y={32} />
      <>
        <Input placeholder="Input" type="text" status={inputStatusError} />
        <Feedback show={!!inputStatusError} status={inputStatusError}>
          0/6 characters
        </Feedback>
      </>
      <Divider y={32} />
      <>
        <Input
          placeholder="Input"
          type="text"
          status={inputStatusError}
          isError={true}
        />
        <Feedback show={!!inputStatusError} status={inputStatusError}>
          0/6 characters
        </Feedback>
      </>
      <Divider y={32} />
      <InputGroup>
        <Input placeholder="Input" type="text" />
        <InputGroupRight>
          <Text size="small">@lacrypta.ar</Text>
        </InputGroupRight>
      </InputGroup>
      <Divider y={32} />
      <InputGroup>
        <Input placeholder="Input" type="text" />
        <InputGroupRight>
          <Button size="small" variant="bezeled" onClick={() => alert('hola')}>
            Pegar
          </Button>
        </InputGroupRight>
      </InputGroup>
      <Divider y={32} />
      <InputWithLabel
        label="Label"
        name="test"
        placeholder="InputWithLabel"
        type="text"
        onChange={() => null}
      />
      <Divider y={32} />
      {/* <Flex direction="column" gap={8}>
        <Alert
          title="Success"
          text="Lorem ipsum dolor sit amet, consectetur adipisicing elit"
        />
        <Alert
          title="Warning"
          text="Lorem ipsum dolor sit amet, consectetur adipisicing elit"
          variant="warning"
        />
        <Alert
          title="Error"
          text="Lorem ipsum dolor sit amet, consectetur adipisicing elit"
          variant="error"
        />
      </Flex> */}
      <Divider y={32} />
      <Flex direction="column" gap={4}>
        <Combobox
          selected={tokenSelected}
          list={listTokens}
          onChange={setTokenSelected}
        >
          <Text>Ver listado</Text>
        </Combobox>
        <Combobox
          selected={1}
          list={listTokens}
          onChange={setTokenSelected}
          showPrice
        />
      </Flex>
      <Divider y={32} />
      <QRCode value="test" />
      <Divider y={32} />
      <Flex direction="column" gap={4}>
        <Accordion trigger="Clave privada">
          <QRCode value="test" />
          <AccordionBody>
            <Flex>
              <Flex direction="column" gap={4} flex={1}>
                <Text size="small" color={theme.colors.gray50}>
                  Clave privada
                </Text>
                <Text>npub1q....hq7lanw0</Text>
              </Flex>
              <Button
                size="small"
                color="secondary"
                variant="bezeled"
                onClick={() => alert('hola')}
              >
                Copiar
              </Button>
            </Flex>
            <Divider y={16} />
            <Flex>
              <Button variant="borderless" onClick={() => alert('hola')}>
                ¿Que es una clave privada?
              </Button>
            </Flex>
          </AccordionBody>
        </Accordion>
        <Accordion trigger="Activos disponibles">
          <AccordionBody>
            <ul>
              <li>
                <Flex align="center">
                  <Flex gap={8} flex={1} align="center">
                    <img
                      alt="PintToken"
                      src="/tokens/PintaToken.png"
                      width={28}
                      height={28}
                    />
                    <Text>PintaToken</Text>
                  </Flex>
                  <Flex gap={4} align="center">
                    <Text>3</Text>
                    <Text size="small" color={theme.colors.gray50}>
                      PNT
                    </Text>
                  </Flex>
                </Flex>
              </li>
            </ul>
          </AccordionBody>
        </Accordion>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <Avatar>
          <AvatarImage src="https://github.com/libp2p.png" alt="@jonallamas" />
        </Avatar>
        <Avatar>
          <Text size="small">JL</Text>
        </Avatar>
      </Flex>
      <Divider y={32} />
      <Flex gap={4}>
        <DotStatus status="success" />
        <DotStatus status="warning" />
        <DotStatus status="error" />
      </Flex>
      <Divider y={32} />
    </Container>
  )
}
