import { useState } from 'react'
import { ReplacementParams, useTranslation } from './useTranslations'

export interface IError {
  visible: boolean
  text: string
}

export interface IUseErrors {
  errorInfo: IError
  modifyError: (text: string, params?: ReplacementParams) => void
  resetError: () => void
}

export const initialErrorState: IError = {
  visible: false,
  text: ''
}

export default function useErrors(): IUseErrors {
  const { t } = useTranslation()
  const [errorInfo, setErrorInfo] = useState<IError>(initialErrorState)

  const getError = (errorCode: string, params?: ReplacementParams): string => {
    const text: string = t(errorCode, params)
    return text.toString()
  }

  const modifyError = (errorCode: string, params?: ReplacementParams) => {
    const text: string = getError(errorCode, params)
    setErrorInfo({ text, visible: true })
  }

  const removeError = () => setErrorInfo({ ...errorInfo, visible: false })

  const resetError = () => {
    if (errorInfo.visible) removeError()
  }
  return {
    errorInfo,
    modifyError,
    resetError
  }
}
