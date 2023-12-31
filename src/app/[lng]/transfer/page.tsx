'use client'

import { CaretRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled'
import { useRouter } from 'next/navigation'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputGroupRight,
  LinkButton,
  Text
} from '@/components/UI'

import config from '@/constants/config'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTransferContext } from '@/context/TransferContext'
import { useTranslation } from '@/context/TranslateContext'
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress'
import useErrors from '@/hooks/useErrors'
import { getUsername } from '@/interceptors/identity'
import { getMultipleTags } from '@/lib/events'
import theme from '@/styles/theme'
import { TransactionDirection, TransactionType } from '@/types/transaction'
import { useEffect, useState } from 'react'
import RecipientElement from './components/RecipientElement'

export default function Page() {
  const { t } = useTranslation()
  const {
    user: { identity },
    userTransactions
  } = useLaWalletContext()
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

    userTransactions.forEach(async tx => {
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
          const formattedLud16: string = `${username}@${config.env.WALLET_DOMAIN}`
          if (!lastDest.includes(formattedLud16)) {
            lastDest.push(formattedLud16)
            setLastDestinations(lastDest)
          }
        }
      }
    })
  }

  useEffect(() => {
    if (userTransactions.length) loadLastDestinations()
  }, [userTransactions.length])

  useEffect(() => {
    router.prefetch('/scan')
  }, [router])

  return (
    <>
      <Navbar showBackPage={true} title={t('TRANSFER_MONEY')} />

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
              disabled={loading}
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
                  <Flex
                    key={lud16}
                    onClick={() => initializeTransfer(lud16)}
                    direction="column"
                  >
                    <Divider y={8} />
                    <Flex align="center">
                      <RecipientElement lud16={lud16} />
                      <Icon>
                        <CaretRightIcon />
                      </Icon>
                    </Flex>
                    <Divider y={8} />
                  </Flex>
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
              loading={loading}
            >
              {t('CONTINUE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}
