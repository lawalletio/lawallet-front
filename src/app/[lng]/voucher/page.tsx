'use client'

import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { LaWalletContext } from '@/context/LaWalletContext'

import { blacklistedDomains, validateEmail } from '@/lib/email'
import useErrors from '@/hooks/useErrors'
import { useTranslation } from '@/hooks/useTranslations'

import {
  Button,
  Divider,
  Feedback,
  Flex,
  Heading,
  Input,
  Text,
  Pin
} from '@/components/UI'
import Container from '@/components/Layout/Container'
import { Navbar } from '@/components/Layout/Navbar/style'
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'
import { claimVoucher, requestVoucher } from '@/interceptors/vouchers'
import { BtnLoader } from '@/components/Loader/Loader'
import { CACHE_CLAIM_VOUCHER } from '@/constants/constants'
import { checkClaimVoucher } from '@/lib/utils'

const tldRegex =
  /(?=^.{4,253}$)(^((?!-)[a-z0-9-]{0,62}[a-z0-9]\.)+[a-z]{2,63}$)/i
const usrRegex = /^[a-z0-9_.+-]+$/i

function cleanupEmail(
  email: string
): { cleanUser: string; cleanDomain: string; normal: string } | null {
  const isEmail = validateEmail(email)
  if (!isEmail) return null

  const [userParts, ...domainParts] = email.split('@')
  const user = userParts ?? ''
  const domain = domainParts.join('@')

  if (!usrRegex.test(user) || !tldRegex.test(domain)) return null

  return {
    cleanUser: (user.split('+')[0] ?? '').split('.').join('').toLowerCase(),
    cleanDomain: domain.toLowerCase(),
    normal: email
  }
}

const RequestVoucher = () => {
  const [viewCode, setViewCode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [inputEmail, setInputEmail] = useState<string>('')
  const [claimCode, setClaimCode] = useState<string>('')

  const { identity, sortedTransactions } = useContext(LaWalletContext)

  const { t } = useTranslation()
  const router = useRouter()
  const errors = useErrors()

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    errors.resetError()
    const text: string = e.target.value
    setInputEmail(text)
  }

  const handleChangeCode = (text: string) => {
    errors.resetError()
    setClaimCode(text.toUpperCase())
  }

  const handleRequestVoucher = () => {
    setLoading(true)
    const email = cleanupEmail(inputEmail)
    if (!email || blacklistedDomains.includes(email.cleanDomain)) {
      errors.modifyError('INVALID_EMAIL')
      return
    }

    const cleanEmail = `${email.cleanUser}@${email.cleanDomain}`

    requestVoucher(identity.username, cleanEmail)
      .then(res => {
        Object.keys(res).includes('error')
          ? errors.modifyError(res['error']!)
          : setViewCode(true)

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleClaimVoucher = (code: string) => {
    setLoading(true)

    claimVoucher(identity.username, code)
      .then(res => {
        if (Object.keys(res).includes('error')) {
          errors.modifyError(res['error']!)
        } else {
          localStorage.setItem(`${CACHE_CLAIM_VOUCHER}_${identity.hexpub}`, '1')
          router.push('/voucher/finish')
        }

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleClick = () => {
    if (loading) return
    !viewCode ? handleRequestVoucher() : handleClaimVoucher(claimCode)
  }

  useEffect(() => {
    const alreadyClaimed: boolean = checkClaimVoucher(
      sortedTransactions,
      identity.hexpub
    )

    console.log(alreadyClaimed)

    alreadyClaimed
      ? router.push('/dashboard')
      : router.prefetch('/transfer/finish')
  }, [router])

  useActionOnKeypress('Enter', handleClick, [inputEmail])

  return (
    <>
      <Navbar />
      <Container size="small">
        <Flex direction="column" justify="center">
          <Heading as="h2">{t('VOUCHER_REQUEST_TITLE')}</Heading>

          <Divider y={8} />

          <Input
            placeholder={t('INSERT_EMAIL')}
            onChange={handleChangeEmail}
            value={inputEmail}
            disabled={viewCode}
          />

          {viewCode && (
            <>
              <Feedback show={true} status={'success'}>
                {t('RECEIVE_CODE_EMAIL')}
              </Feedback>

              <Divider y={24} />

              <Text>{t('INSERT_CODE')}</Text>

              <Divider y={8} />

              <Pin
                length={4}
                autoFocus={true}
                value={claimCode}
                onChange={handleChangeCode}
                onComplete={handleClaimVoucher}
              />
            </>
          )}

          <Feedback show={errors.errorInfo.visible} status={'error'}>
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
              onClick={() => router.push('/dashboard')}
            >
              {t('CANCEL')}
            </Button>
            <Button
              onClick={handleClick}
              disabled={loading || !inputEmail.length}
            >
              {loading ? <BtnLoader /> : !viewCode ? t('SEND') : t('CLAIM')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}

export default RequestVoucher
