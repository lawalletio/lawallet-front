'use client'

import { useSearchParams } from 'next/navigation'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'

import { BtnLoader } from '@/components/Loader/Loader'
import StartView from '@/components/StartView/StartView'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputGroupRight,
  Text
} from '@/components/UI'
import { WALLET_DOMAIN } from '@/constants/config'
import { regexUserName, useCreateIdentity } from '@/hooks/useCreateIdentity'
import { useTranslation } from '@/hooks/useTranslations'
import { existIdentity } from '@/interceptors/identity'
import { ChangeEvent, useEffect, useState } from 'react'

export type AccountProps = {
  nonce: string
  card: string
  name: string
}

let checkExistUsername: NodeJS.Timeout

export default function Page() {
  const { t } = useTranslation()
  const [activeStartView, setActiveStartView] = useState<boolean>(true)
  const [accountInfo, setAccountInfo] = useState<AccountProps>({
    nonce: '',
    card: '',
    name: ''
  })

  const { handleCreateIdentity, loading, errors } = useCreateIdentity()
  const params = useSearchParams()

  useEffect(() => {
    const nonce: string = params.get('i') || ''
    // const card: string = params.get('c') || ''

    if (!nonce) {
      errors.modifyError('INVALID_NONCE')
    } else {
      setAccountInfo({ ...accountInfo, nonce })
    }
  }, [])

  const validateUsername = (username: string) => {
    const invalidUsername = !regexUserName.test(username)

    if (invalidUsername) {
      errors.modifyError('INVALID_USERNAME')
      return false
    }
    return true
  }

  const checkIfExistName = (username: string) => {
    if (checkExistUsername) clearTimeout(checkExistUsername)
    checkExistUsername = setTimeout(async () => {
      const nameWasTaken = await existIdentity(username)
      if (nameWasTaken) {
        errors.modifyError('NAME_ALREADY_TAKEN')
        return false
      }
    }, 350)
  }

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const username: string = e.target.value
    errors.resetError()

    if (!username.length && accountInfo.name.length) {
      setAccountInfo({ ...accountInfo, name: '' })
      if (checkExistUsername) clearTimeout(checkExistUsername)
      return
    }

    const validUsername: boolean = validateUsername(username)
    if (validUsername) {
      setAccountInfo({
        ...accountInfo,
        name: username
      })

      checkIfExistName(username)
    }
  }

  if (activeStartView)
    return <StartView onClick={() => setActiveStartView(false)} />

  return (
    <>
      <Navbar />
      <Container size="small">
        <Flex direction="column" justify="center">
          <Heading as="h2">{t('REGISTER_USER')}</Heading>

          <Divider y={8} />
          <InputGroup>
            <Input
              onChange={handleChangeUsername}
              placeholder="Satoshi"
              type="text"
              id="username"
              name="username"
              status={errors.errorInfo.visible ? 'error' : undefined}
              autoFocus={true}
              value={accountInfo.name}
            />
            <InputGroupRight>
              <Text size="small">@{WALLET_DOMAIN}</Text>
            </InputGroupRight>
          </InputGroup>
          <Feedback
            show={errors.errorInfo.visible}
            status={errors.errorInfo.visible ? 'error' : undefined}
          >
            {errors.errorInfo.text}
          </Feedback>
        </Flex>
      </Container>
      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button
              variant="bezeledGray"
              onClick={() => setActiveStartView(true)}
            >
              {t('CANCEL')}
            </Button>
            <Button
              onClick={() => {
                if (accountInfo.name && accountInfo.nonce)
                  handleCreateIdentity(accountInfo)
              }}
              disabled={loading || !accountInfo.nonce.length}
            >
              {loading ? <BtnLoader /> : t('CONFIRM')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
