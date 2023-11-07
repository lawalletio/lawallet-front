import { fontSecondary } from '@/styles/fonts'
import { Textarea } from './style'

interface ComponentProps {
  placeholder: string
  status?: 'success' | 'error'
  onChange?: (e: any) => void
  id?: string
  name?: string
  value?: string
  disabled?: boolean
}

export default function Component(props: ComponentProps) {
  const {
    placeholder,
    status,
    onChange,
    id = '',
    name = '',
    value,
    disabled = false
  } = props

  return (
    <Textarea
      className={fontSecondary.className}
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      $showValidate={!status}
      $isSuccess={status && status === 'success'}
    ></Textarea>
  )
}
