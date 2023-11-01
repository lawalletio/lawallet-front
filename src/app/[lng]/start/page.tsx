'use client'

import { useRouter, useSearchParams } from 'next/navigation'

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
import {
  AccountProps,
  regexUserName,
  useCreateIdentity
} from '@/hooks/useCreateIdentity'
import { useTranslation } from '@/hooks/useTranslations'
import { existIdentity, validateNonce } from '@/interceptors/identity'
import { ChangeEvent, useEffect, useState } from 'react'
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'

interface CreateIdentityParams extends AccountProps {
  isValidNonce: boolean
  loading: boolean
}

let checkExistUsername: NodeJS.Timeout

export default function Page() {
  const { t } = useTranslation()

  const [activeStartView, setActiveStartView] = useState<boolean>(true)

  const [accountInfo, setAccountInfo] = useState<CreateIdentityParams>({
    nonce: '',
    card: '',
    name: '',
    isValidNonce: false,
    loading: true
  })

  const { handleCreateIdentity, loading, errors } = useCreateIdentity()
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const nonce: string = params.get('i') || ''
    // const card: string = params.get('c') || ''

    if (!nonce) {
      setAccountInfo({ ...accountInfo, loading: false })
    } else {
      validateNonce(nonce).then(isValidNonce => {
        setAccountInfo({
          ...accountInfo,
          nonce,
          isValidNonce,
          loading: false
        })
      })
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
        name: username.toLowerCase()
      })

      checkIfExistName(username)
    }
  }

  const handleConfirm = () => {
    if (accountInfo.name && accountInfo.nonce) handleCreateIdentity(accountInfo)
  }

  useActionOnKeypress('Enter', handleConfirm, [accountInfo.name])

  useEffect(() => {
    router.prefetch('/dashboard')
  }, [])

  if (activeStartView)
    return (
      <StartView
        verifyingNonce={accountInfo.loading}
        isValidNonce={accountInfo.isValidNonce}
        onClick={() => setActiveStartView(false)}
      />
    )

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
              onClick={handleConfirm}
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
