'use client'
import Container from '@/components/Layout/Container'
import { Navbar } from '@/components/Layout/Navbar/style'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Heading,
  Input,
  Text
} from '@/components/UI'
import { LaWalletContext } from '@/context/LaWalletContext'
import useErrors from '@/hooks/useErrors'
import { useTranslation } from '@/hooks/useTranslations'
import { claimVoucher, requestVoucher } from '@/interceptors/vouchers'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useContext, useState } from 'react'
import VerificationInput from 'react-verification-input'

const RequestVoucher = () => {
  const [viewCode, setViewCode] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [claimCode, setClaimCode] = useState<string>('')

  const { identity } = useContext(LaWalletContext)

  const { t } = useTranslation()
  const router = useRouter()
  const errors = useErrors()

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    errors.resetError()
    const text: string = e.target.value
    setEmail(text)
  }

  const handleChangeCode = (text: string) => {
    errors.resetError()
    setClaimCode(text.toUpperCase())
  }

  const handleClick = () => {
    if (!viewCode) {
      //   requestVoucher(identity.username, email).then(res => {
      //     if (!Object.keys(res).includes('error')) setViewCode(true)
      //   })

      //TMP
      setViewCode(true)
    } else {
      //   claimVoucher(identity.username, claimCode).then(res => {
      //     console.log(res)
      //   })

      //TMP
      setViewCode(false)
    }
  }

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
            value={email}
            disabled={viewCode}
          />

          {viewCode && (
            <>
              <Divider y={24} />

              <Text>{t('INSERT_CODE')}</Text>

              <Divider y={8} />

              <VerificationInput
                onChange={handleChangeCode}
                length={8}
                autoFocus={true}
                value={claimCode}
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
            <Button onClick={handleClick}>
              {!viewCode ? t('SEND') : t('CLAIM')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}

export default RequestVoucher
