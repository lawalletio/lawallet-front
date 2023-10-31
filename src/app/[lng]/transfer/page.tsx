'use client'

import { useRouter } from 'next/navigation'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputGroupRight,
  LinkButton
} from '@/components/UI'

import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'
import useErrors from '@/hooks/useErrors'
import { useTranslation } from '@/hooks/useTranslations'
import { useState } from 'react'
import { useTransferContext } from '@/context/TransferContext'
import { BtnLoader } from '@/components/Loader/Loader'

export default function Page() {
  const { t } = useTranslation()
  const { prepareTransaction, transferInfo } = useTransferContext()

  const [inputText, setInputText] = useState<string>(transferInfo.data)
  const [loading, setLoading] = useState<boolean>(false)

  const errors = useErrors()
  const router = useRouter()

  const initializeTransfer = async (data: string) => {
    if (loading) return
    setLoading(true)

    const prepared: boolean = await prepareTransaction(data)
    if (!prepared) {
      errors.modifyError('INVALID_RECIPIENT')
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    if (!inputText.length) return errors.modifyError('EMPTY_RECIPIENT')
    initializeTransfer(inputText)
  }

  useActionOnKeypress('Enter', handleContinue, [inputText])

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h6">{t('TRANSFER_MONEY')}</Heading>
        </Flex>
      </Navbar>

      <Container size="small">
        <Divider y={16} />
        <Flex flex={1} direction="column">
          <InputGroup>
            <Input
              onChange={e => {
                errors.resetError()
                setInputText(e.target.value)
              }}
              placeholder={t('TRANSFER_DATA_PLACEHOLDER')}
              type="text"
              autoFocus={true}
              value={inputText}
              status={errors.errorInfo.visible ? 'error' : undefined}
            />
            <InputGroupRight>
              <Button size="small" variant="bezeled" onClick={handlePasteInput}>
                {t('PASTE')}
              </Button>
            </InputGroupRight>
          </InputGroup>

          <Feedback show={errors.errorInfo.visible} status={'error'}>
            {errors.errorInfo.text}
          </Feedback>

          <Divider y={16} />
          <Flex>
            <LinkButton color="secondary" variant="bezeled" href={'/scan'}>
              {t('SCAN_QR_CODE')}
            </LinkButton>
          </Flex>
          <Divider y={16} />
          {/* Ultimos 3 destinos */}
          {/* <Text size="small" color={theme.colors.gray50}>
            {t('LAST_RECIPIENTS')}
          </Text>
          <Divider y={12} />

          <div onClick={() => initializeTransfer('jona@hodl.ar')}>
            <RecipientElement lud16="jona@hodl.ar" />
          </div>
          <Divider y={16} /> */}
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
              onClick={handleContinue}
              disabled={loading || inputText.length === 0}
            >
              {loading ? <BtnLoader /> : t('CONTINUE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
