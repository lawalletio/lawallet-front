import { Divider, Flex, Text, Button, CardAlert } from '@/components/UI'
import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import HomeDescription from '@/components/HomeDescription'

import theme from '@/styles/theme'
import { useEffect, useState } from 'react'
import { checkIOS } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslations'
import { useMediaQuery } from '@uidotdev/usehooks'
import { Loader } from '../Loader/Loader'
import { LAWALLET_VERSION } from '@/constants/constants'

const StartView = ({ onClick, verifyingNonce, isValidNonce }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')
  const [isIOS, setIsIOS] = useState<boolean>(false)

  useEffect(() => {
    if (isValidNonce) setIsIOS(checkIOS(navigator))
  }, [isValidNonce])

  return (
    <Container size="small">
      <Divider y={16} />
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={theme.colors.gray50}>
          {LAWALLET_VERSION}
        </Text>
      </Flex>

      <Flex direction="column">
        {verifyingNonce ? (
          <Loader />
        ) : (
          <>
            <HomeDescription hasNonce={isValidNonce} />
            <Divider y={16} />

            {isMobile && isIOS && (
              <>
                <CardAlert
                  title={t('RECOMMEND_SAFARI_TITLE')}
                  description={
                    <>
                      <strong>{t('RECOMMEND_SAFARI')}</strong>{' '}
                      {t('RECOMMEND_SAFARI_REASON')}
                    </>
                  }
                />
                <Divider y={16} />
              </>
            )}

            <Flex>
              <Button onClick={onClick}>{t('START')}</Button>
            </Flex>
          </>
        )}
      </Flex>
      <Divider y={32} />
    </Container>
  )
}

export default StartView
