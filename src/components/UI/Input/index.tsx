'use client'

import {
  CheckIcon,
  AlertIcon
} from '@bitcoin-design/bitcoin-icons-react/filled'
import { BtnLoader } from '@/components/Loader/Loader'

import theme from '@/styles/theme'

import { Input as Default, InputBox, InputIcon } from './style'

type Type = 'text' | 'password' | 'number' | 'email'
type Status = 'success' | 'error'

interface InputProps {
  placeholder: string
  value?: string
  type?: Type
  id?: string
  name?: string
  status?: Status
  autoFocus?: boolean
  onChange: (e: any) => void
  isLoading?: boolean
  isChecked?: boolean
  isError?: boolean
  disabled?: boolean
}

export default function Input(props: InputProps) {
  const {
    placeholder,
    value,
    type = 'text',
    id = '',
    name = '',
    status,
    autoFocus = false,
    onChange,
    isLoading = false,
    isChecked = false,
    isError = false,
    disabled = false
  } = props

  return (
    <InputBox $withIcon={isLoading}>
      <Default
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        value={value}
        $showValidate={!status}
        $isSuccess={status && status === 'success'}
        autoFocus={autoFocus}
        disabled={disabled}
      />
      {(isLoading || isChecked || isError) && (
        <InputIcon>
          {isLoading && <BtnLoader />}
          {isChecked && <CheckIcon color={theme.colors.success} />}
          {isError && <AlertIcon color={theme.colors.error} />}
        </InputIcon>
      )}
    </InputBox>
  )
}
