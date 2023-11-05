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
  LinkButton,
  Text
} from '@/components/UI'

import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'
import useErrors from '@/hooks/useErrors'
import { useTranslation } from '@/hooks/useTranslations'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useTransferContext } from '@/context/TransferContext'
import { BtnLoader } from '@/components/Loader/Loader'
import { LaWalletContext } from '@/context/LaWalletContext'
import { TransactionDirection, TransactionType } from '@/types/transaction'
import RecipientElement from './components/RecipientElement'
import theme from '@/styles/theme'
import { getUsername } from '@/interceptors/identity'
import { WALLET_DOMAIN } from '@/constants/config'
import { getMultipleTags } from '@/lib/events'

export default function Page() {
  const { t } = useTranslation()
  const { identity, sortedTransactions } = useContext(LaWalletContext)
  const { prepareTransaction, transferInfo } = useTransferContext()

  const [lastDestinations, setLastDestinations] = useState<string[]>([])
  const [inputText, setInputText] = useState<string>(transferInfo.data)
  const [loading, setLoading] = useState<boolean>(false)

  const errors = useErrors()
  const router = useRouter()

  const initializeTransfer = async (data: string) => {
    if (loading) return
    setLoading(true)

    const cleanData: string = data.trim()
    const prepared: boolean = await prepareTransaction(cleanData)
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

  const loadLastDestinations = () => {
    const lastDest: string[] = []

    sortedTransactions.forEach(async tx => {
      if (
        tx.type === TransactionType.INTERNAL &&
        tx.direction === TransactionDirection.OUTGOING
      ) {
        const txPubkeys: string[] = getMultipleTags(tx.events[0].tags, 'p')
        if (txPubkeys.length !== 2) return

        const receiverPubkey: string = txPubkeys[1]
        if (receiverPubkey === identity.hexpub) return

        const username: string = await getUsername(receiverPubkey)

        if (username.length) {
          const formattedLud16: string = `${username}@${WALLET_DOMAIN}`
          if (!lastDest.includes(formattedLud16)) {
            lastDest.push(formattedLud16)
            setLastDestinations(lastDest)
          }
        }
      }
    })
  }

  useEffect(() => {
    if (sortedTransactions.length) loadLastDestinations()
  }, [sortedTransactions.length])

  useEffect(() => {
    router.prefetch('/scan')
  }, [router])

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
          {Boolean(lastDestinations.length) && (
            <>
              <Text size="small" color={theme.colors.gray50}>
                {t('LAST_RECIPIENTS')}
              </Text>

              <Divider y={12} />

              {lastDestinations.slice(0, 5).map(lud16 => {
                return (
                  <Fragment key={lud16}>
                    <div onClick={() => initializeTransfer(lud16)}>
                      <RecipientElement lud16={lud16} />
                    </div>
                    <Divider y={24} />
                  </Fragment>
                )
              })}
            </>
          )}
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
