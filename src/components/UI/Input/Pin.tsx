'use client'

import VerificationInput from 'react-verification-input'

import { Pin } from './style'

interface InputProps {
  length: number
  value: string
  onChange: (text: string) => void
  onComplete?: (text: string) => void
  autoFocus: boolean
}

export default function Component(props: InputProps) {
  const { length, value, onChange, onComplete, autoFocus } = props

  return (
    <Pin>
      <VerificationInput
        validChars={'0-9'}
        onComplete={onComplete}
        onChange={onChange}
        length={length}
        autoFocus={autoFocus}
        value={value}
      />
    </Pin>
  )
}
