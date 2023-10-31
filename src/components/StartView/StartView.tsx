import { Divider, Flex, Text, Button, CardAlertiPhone } from '@/components/UI'
import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'
import HomeDescription from '@/components/HomeDescription'

import theme from '@/styles/theme'
import { useEffect, useState } from 'react'
import { checkIOS } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslations'
import { useMediaQuery } from '@uidotdev/usehooks'

const StartView = ({ onClick }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')
  const [isIOS, setIsIOS] = useState<boolean>(false)

  useEffect(() => {
    setIsIOS(checkIOS(navigator))
  }, [])

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
      </Flex>
      <Divider y={32} />
    </Container>
  )
}

export default StartView
