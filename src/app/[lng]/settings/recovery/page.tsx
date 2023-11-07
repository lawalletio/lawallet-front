'use client'

import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { useTranslation } from '@/hooks/useTranslations'

import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  ToggleSwitch,
  InfoCopy
} from '@/components/UI'
import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'

import theme from '@/styles/theme'
import { LaWalletContext } from '@/context/LaWalletContext'
import { CACHE_BACKUP_KEY } from '@/constants/constants'

export default function Page() {
  const { t } = useTranslation()
  const router: AppRouterInstance = useRouter()

  const { identity } = useContext(LaWalletContext)

  const [switchOne, setSwitchOne] = useState<boolean>(false)
  const [switchTwo, setSwitchTwo] = useState<boolean>(false)

  const [showRecovery, setShowRecovery] = useState<boolean>(false)

  const handleShowRecovery = () => {
    if (switchOne || switchTwo) setShowRecovery(true)
  }

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('BACKUP_ACCOUNT')}</Heading>
        </Flex>
      </Navbar>

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
