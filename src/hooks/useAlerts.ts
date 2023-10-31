import { useState } from 'react'
import { ReplacementParams } from './useTranslations'

type AlertType = 'success' | 'warning' | 'error'

interface Alert {
  title?: string
  description: string
  type: AlertType
  params?: ReplacementParams
}

export interface UseAlertReturns {
  alert: Alert | null
  showAlert: (props: Alert) => void
}

const useAlert = (): UseAlertReturns => {
  const [alert, setAlert] = useState<Alert | null>(null)

  const showAlert = ({ title, description, type, params }: Alert) => {
    setAlert({
      title,
      description,
      type,
      params
    })

    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }

  return { alert, showAlert }
}

export default useAlert
