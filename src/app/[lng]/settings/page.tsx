'use client'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import Radio from '@/components/Radio/Radio'
import {
  Button,
  Divider,
  Feedback,
  Flex,
  Icon,
  LinkSetting,
  Sheet,
  Text
} from '@/components/UI'
import { ButtonSetting } from '@/components/UI/ButtonSetting/style'
import {
  CACHE_BACKUP_KEY,
  LAWALLET_VERSION,
  STORAGE_IDENTITY_KEY
} from '@/constants/constants'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import useErrors from '@/hooks/useErrors'

import theme from '@/styles/theme'
import { defaultIdentity } from '@/types/identity'
import { CaretRightIcon } from '@bitcoin-design/bitcoin-icons-react/filled'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const { lng, t, changeLanguage } = useTranslation()
  const {
    user: { identity, setUser }
  } = useLaWalletContext()

  const [sheetLanguage, setSheetLanguage] = useState<boolean>(false)
  const router: AppRouterInstance = useRouter()
  const errors = useErrors()

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
      setUser(defaultIdentity)
      router.push('/login')
    }
  }

  return (
    <>
      <Navbar showBackPage={true} title={t('SETTINGS')} />

      <Container size="small">
        <Divider y={16} />
        <Text size="small" color={theme.colors.gray50}>
          {t('ACCOUNT')}
        </Text>
        <Divider y={8} />
        <Flex direction="column" gap={4}>
          <LinkSetting href="/settings/cards">{t('MY_CARDS')}</LinkSetting>
        </Flex>
        <Divider y={8} />

        <Flex direction="column" gap={4}>
          <ButtonSetting onClick={() => setSheetLanguage(!sheetLanguage)}>
            {t('LANGUAGE')}

            <Flex flex={1} align="end" justify="end">
              <Text isBold={true}>{lng.toUpperCase()}</Text>
            </Flex>

            <Icon size="small" color={theme.colors.gray40}>
              <CaretRightIcon />
            </Icon>
          </ButtonSetting>
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

      <Sheet
        title={t('CHANGE_LANGUAGE')}
        isOpen={sheetLanguage}
        onClose={() => setSheetLanguage(false)}
      >
        <Radio
          text={t('ENGLISH')}
          checked={lng === 'en'}
          onClick={() => {
            if (lng !== 'en') changeLanguage('en')
          }}
        />

        <Radio
          text={t('SPANISH')}
          checked={lng === 'es'}
          onClick={() => {
            if (lng !== 'es') changeLanguage('es')
          }}
        />
      </Sheet>
    </>
  )
}
