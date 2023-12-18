import Container from '@/components/Layout/Container'
import { Flex, Text } from '@/components/UI'
import { useTranslation } from '@/context/TranslateContext'
import theme from '@/styles/theme'
import EmptySvg from './EmptySvg'

const EmptyCards = () => {
  const { t } = useTranslation()

  return (
    <Container size="medium">
      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        gap={16}
      >
        <EmptySvg />
        <Text isBold={true}>{t('NO_HAVE_CARDS')}</Text>
        <Text size="small" color={theme.colors.gray50}>
          {t('NOT_FOUND_CARD')}
        </Text>
      </Flex>
    </Container>
  )
}

export default EmptyCards
