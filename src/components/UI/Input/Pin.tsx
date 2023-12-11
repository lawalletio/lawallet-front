'use client'

import VerificationInput from 'react-verification-input'

import { Pin as Default } from './style'

interface InputProps {
  length: number
  value: string
  onChange: (text: string) => void
  onComplete?: (text: string) => void
  autoFocus?: boolean
}

export default function Pin(props: InputProps) {
  const { length = 4, value, onChange, onComplete, autoFocus } = props

  return (
    <Default>
      <VerificationInput
        validChars={'0-9'}
        onComplete={onComplete}
        onChange={onChange}
        length={length}
        autoFocus={autoFocus}
        value={value}
      />
    </Default>
  )
}
