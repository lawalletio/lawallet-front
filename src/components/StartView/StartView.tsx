import {
  Divider,
  Flex,
  Text,
  Button,
  CardAlertiPhone,
  Feedback
} from '@/components/UI'
import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import HomeDescription from '@/components/HomeDescription'

import theme from '@/styles/theme'
import { useEffect, useState } from 'react'
import { checkIOS } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslations'
import { useMediaQuery } from '@uidotdev/usehooks'
import { Loader } from '../Loader/Loader'
import { useRouter } from 'next/navigation'
import { IDENTITY_ENDPOINT } from '@/constants/config'

const StartView = ({ onClick, verifyingNonce, isValidNonce }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (isValidNonce) setIsIOS(checkIOS(navigator))
  }, [isValidNonce])

  return (
    <Container size="small">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={theme.colors.gray50}>
          v1.0.0
        </Text>
      </Flex>

      <Flex direction="column">
        {verifyingNonce ? (
          <Loader />
        ) : isValidNonce ? (
          <>
            <HomeDescription />
            <Divider y={16} />

            {isMobile && isIOS && (
              <>
                <CardAlertiPhone />
                <Divider y={16} />
              </>
            )}

            <Flex>
              <Button onClick={onClick}>{t('START')}</Button>
            </Flex>
          </>
        ) : (
          <>
            <Flex align="center" justify="center">
              <Feedback show={true} status={'error'}>
                {t('INVALID_NONCE')}
              </Feedback>
            </Flex>

            <Divider y={16} />

            <Flex>
              <Button onClick={() => router.replace(IDENTITY_ENDPOINT)}>
                {t('BACK_TO_HOME')}
              </Button>
            </Flex>
          </>
        )}
      </Flex>
      <Divider y={32} />
    </Container>
  )
}

export default StartView
