'use client'

import { useEffect, useId, useState } from 'react'

import Text from '../Text'

import { ToggleSwitch } from './style'

interface ComponentProps {
  label?: string
  enabled?: boolean
  onChange: (e: boolean) => void
}

export default function Component(props: ComponentProps) {
  const { label, onChange, enabled } = props

  const [active, setActive] = useState(enabled)

  const id = useId()

  const handleChange = () => {
    setActive(!active)
    onChange(!active)
  }

  useEffect(() => {
    if (enabled !== active) setActive(enabled)
  }, [enabled])

  return (
    <ToggleSwitch>
      {label ? <Text>{label}</Text> : null}
      <input type="checkbox" id={id} checked={enabled} />
      <label htmlFor={id} onClick={handleChange}>
        Toggle
      </label>
    </ToggleSwitch>
  )
}
