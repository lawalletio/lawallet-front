'use client'

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useTranslation } from '@/context/TranslateContext'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Flex,
  InfoCopy,
  Text,
  ToggleSwitch
} from '@/components/UI'

import { CACHE_BACKUP_KEY } from '@/constants/constants'
import { useLaWalletContext } from '@/context/LaWalletContext'
import theme from '@/styles/theme'

export default function Page() {
  const { t } = useTranslation()
  const router: AppRouterInstance = useRouter()

  const {
    user: { identity }
  } = useLaWalletContext()
  const [switchOne, setSwitchOne] = useState<boolean>(false)
  const [switchTwo, setSwitchTwo] = useState<boolean>(false)

  const [showRecovery, setShowRecovery] = useState<boolean>(false)

  const handleShowRecovery = () => {
    if (switchOne || switchTwo) setShowRecovery(true)
  }

  return (
    <>
      <Navbar
        title={t('BACKUP_ACCOUNT')}
        showBackPage={true}
        overrideBack={'/settings'}
      />

      {showRecovery ? (
        <>
          <Container size="small">
            <InfoCopy
              title={t('PRIVATE_KEY')}
              value={identity.privateKey}
              onCopy={() => {
                localStorage.setItem(
                  `${CACHE_BACKUP_KEY}_${identity.hexpub}`,
                  '1'
                )
              }}
            />
            <Divider y={16} />
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
              </Flex>
              <Divider y={32} />
            </Container>
          </Flex>
        </>
      ) : (
        <>
          <Container size="small">
            <Divider y={16} />
            <Text size="small" color={theme.colors.gray50}>
              {t('UNDERSTAND_WHAT')}
            </Text>
            <Divider y={8} />
            <Flex direction="column" gap={4}>
              <ToggleSwitch label={t('LOSE_KEY')} onChange={setSwitchOne} />
              <ToggleSwitch label={t('SHARE_KEY')} onChange={setSwitchTwo} />
            </Flex>
            <Divider y={16} />
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
                  onClick={handleShowRecovery}
                  disabled={!switchOne || !switchTwo}
                >
                  {t('CONFIRM')}
                </Button>
              </Flex>
              <Divider y={32} />
            </Container>
          </Flex>
        </>
      )}
    </>
  )
}
