import {
  InputGroup,
  InputGroupRight,
  InputWithLabel,
  Text
} from '@/components/UI'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import { formatToPreference } from '@/lib/utils/formatter'
import React from 'react'

const LimitInput = ({ amount, onChange }) => {
  const { t, lng } = useTranslation()
  const { configuration, converter } = useLaWalletContext()

  return (
    <InputGroup>
      <InputWithLabel
        onChange={onChange}
        name="max-amount"
        label={t('MAX_AMOUNT')}
        placeholder="0"
        value={converter
          .convertCurrency(amount, 'SAT', configuration.props.currency)
          .toString()}
      />

      <InputGroupRight>
        <Text size="small">{configuration.props.currency}</Text>
      </InputGroupRight>
    </InputGroup>
  )
}

export default LimitInput
