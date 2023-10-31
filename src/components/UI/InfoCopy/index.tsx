import { copy } from '@/lib/share'
import { useTranslation } from '@/hooks/useTranslations'
import useAlert from '@/hooks/useAlerts'

import Flex from '../Flex'
import Text from '../Text'
import Button from '../Button'
import Alert from '../Alert'

import theme from '@/styles/theme'
import { InfoCopy } from './style'

interface ComponentProps {
  title: string
  value: string
}

export default function Component(props: ComponentProps) {
  const { title, value } = props

  const { t } = useTranslation()
  const { alert, showAlert } = useAlert()

  const handleCopy = () => {
    showAlert({
      description: 'SUCCESS_COPY',
      type: 'success'
    })
    copy(value)
  }

  return (
    <>
      <Alert
        title={alert?.title}
        description={alert?.description}
        type={alert?.type}
        isOpen={!!alert}
      />
      <InfoCopy>
        <Flex align="center" gap={8} flex={1}>
          <Flex direction="column" flex={1}>
            <Text size="small" color={theme.colors.gray50}>
              {title}
            </Text>
            <Text>{value}</Text>
          </Flex>
          <div>
            <Button size="small" variant="bezeled" onClick={handleCopy}>
              {t('COPY')}
            </Button>
          </div>
        </Flex>
      </InfoCopy>
    </>
  )
}
