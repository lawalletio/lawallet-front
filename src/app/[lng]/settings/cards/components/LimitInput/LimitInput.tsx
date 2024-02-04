import {
  InputGroup,
  InputGroupRight,
  InputWithLabel,
  Text
} from '@/components/UI'
import { useTranslation } from '@/context/TranslateContext'
import React from 'react'

const LimitInput = ({ amount, currency, onChange }) => {
  const { t } = useTranslation()

  return (
    <InputGroup>
      <InputWithLabel
        onChange={onChange}
        type="number"
        name="max-amount"
        label={t('MAX_AMOUNT')}
        placeholder="0"
        value={amount}
      />

      <InputGroupRight>
        <Text size="small">{currency}</Text>
      </InputGroupRight>
    </InputGroup>
  )
}

export default LimitInput
