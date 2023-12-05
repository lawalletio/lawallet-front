'use client'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Heading,
  LinkSetting,
  Text
} from '@/components/UI'
import {
  CACHE_BACKUP_KEY,
  LAWALLET_VERSION,
  STORAGE_IDENTITY_KEY
} from '@/constants/constants'
import { LaWalletContext } from '@/context/LaWalletContext'
import useErrors from '@/hooks/useErrors'
import { useTranslation } from '@/hooks/useTranslations'

import theme from '@/styles/theme'
import { defaultIdentity } from '@/types/identity'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export default function Page() {
  const { t } = useTranslation()
  const { identity, setUserIdentity } = useContext(LaWalletContext)
  const router: AppRouterInstance = useRouter()
  const errors = useErrors()

  // const switchLanguage = () => {
  //   lng === 'es' ? changeLanguage('en') : changeLanguage('es')
  // }

  const logoutSession = () => {
    const cachedBackup = localStorage.getItem(
      `${CACHE_BACKUP_KEY}_${identity.hexpub}`
    )

    if (!cachedBackup) {
      errors.modifyError('ERROR_MADE_BACKUP')
      return
    }

    const confirmation: boolean = confirm(t('CONFIRM_LOGOUT'))

    if (confirmation) {
      localStorage.removeItem(STORAGE_IDENTITY_KEY)
      setUserIdentity(defaultIdentity)
      router.push('/login')
    }
  }

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('SETTINGS')}</Heading>
        </Flex>
      </Navbar>

      <Container size="small">
        <Divider y={16} />
        <Text size="small" color={theme.colors.gray50}>
          {t('ACCOUNT')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting href="/settings/cards">{t('MY_CARDS')}</LinkSetting>
        </Flex>
        <Divider y={16} />
        <Text size="small" color={theme.colors.gray50}>
          {t('SECURITY')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting href="/settings/recovery">
            {t('BACKUP_ACCOUNT')}
          </LinkSetting>
        </Flex>
        {/* <Divider y={16} />
        <Text size="small" color={theme.colors.gray50}>
          {t('ABOUT_US')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting href="https://twitter.com/lawalletok" target="_blank">
            Twitter
          </LinkSetting>
          <LinkSetting href="https://discord.gg/QESv76truh" target="_blank">
            Discord
          </LinkSetting>
        </Flex> */}
        <Divider y={16} />
        <Flex justify="center">
          <Text size="small" color={theme.colors.gray50}>
            LaWallet {LAWALLET_VERSION}
          </Text>
        </Flex>
        <Divider y={16} />

        <Feedback show={errors.errorInfo.visible} status={'error'}>
          <Flex flex={1} align="center" justify="center">
            {errors.errorInfo.text}
          </Flex>

          <Divider y={16} />
        </Feedback>

        <Flex>
          <Button color="error" variant="bezeled" onClick={logoutSession}>
            {t('LOGOUT')}
          </Button>
        </Flex>
        <Divider y={16} />
      </Container>
    </>
  )
}
