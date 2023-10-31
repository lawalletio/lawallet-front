'use client'

import { useId, useState } from 'react'

import Text from '../Text'

import { ToggleSwitch } from './style'

interface ComponentProps {
  label: string
  onChange: (e: boolean) => void
}

export default function Component(props: ComponentProps) {
  const { label, onChange } = props

  const [active, setActive] = useState(false)

  const id = useId()

  const handleChange = () => {
    setActive(!active)
    onChange(!active)
  }

  return (
    <ToggleSwitch>
      <Text>{label}</Text>
      <input type="checkbox" id={id} />
      <label htmlFor={id} onClick={handleChange}>
        Toggle
      </label>
    </ToggleSwitch>
  )
}
