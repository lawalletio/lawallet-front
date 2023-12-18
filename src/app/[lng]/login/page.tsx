'use client'
import { useTranslation } from '@/context/TranslateContext'
import { useRouter } from 'next/navigation'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Heading,
  Textarea
} from '@/components/UI'
import { CACHE_BACKUP_KEY } from '@/constants/constants'
import { useLaWalletContext } from '@/context/LaWalletContext'
import useErrors from '@/hooks/useErrors'
import { getUsername } from '@/interceptors/identity'
import { UserIdentity } from '@/types/identity'
import { getPublicKey, nip19 } from 'nostr-tools'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Page() {
  const {
    user: { setUser }
  } = useLaWalletContext()
  const [keyInput, setKeyInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation()
  const router = useRouter()
  const errors = useErrors()

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    errors.resetError()
    setKeyInput(e.target.value.trim())
  }

  const handleRecoveryAccount = async () => {
    if (keyInput.length < 32) {
      errors.modifyError('KEY_LENGTH_ERROR')
      return
    }

    setLoading(true)

    try {
      const hexpub: string = getPublicKey(keyInput)
      const username: string = await getUsername(hexpub)

      if (!username.length) {
        errors.modifyError('NOT_FOUND_PUBKEY')
        setLoading(false)
        return
      }

      const identity: UserIdentity = {
        username,
        hexpub,
        npub: nip19.npubEncode(hexpub),
        privateKey: keyInput,
        loaded: true
      }

      setUser(identity).then(() => {
        localStorage.setItem(`${CACHE_BACKUP_KEY}_${identity.hexpub}`, '1')
        router.push('/dashboard')
      })
    } catch (err) {
      errors.modifyError('UNEXPECTED_RECEOVERY_ERROR')
    }

    setLoading(false)
  }

  useEffect(() => {
    router.prefetch('/dashboard')
  }, [router])

  return (
    <>
      <Navbar />
      <Container size="small">
        <Flex direction="column" justify="center">
          <Heading as="h2">{t('LOGIN_TITLE')}</Heading>

          <Divider y={8} />
          <Textarea
            placeholder={t('INSERT_PRIVATE_KEY')}
            onChange={handleChangeInput}
          />

          <Feedback show={errors.errorInfo.visible} status={'error'}>
            {errors.errorInfo.text}
          </Feedback>
        </Flex>
      </Container>

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button variant="bezeledGray" onClick={() => router.push('/')}>
              {t('CANCEL')}
            </Button>
            <Button
              onClick={handleRecoveryAccount}
              disabled={!keyInput.length || loading}
              loading={loading}
            >
              {t('LOGIN')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
