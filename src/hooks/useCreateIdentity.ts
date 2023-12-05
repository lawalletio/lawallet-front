import { LaWalletContext } from '@/context/LaWalletContext'
import {
  IdentityResponse,
  claimIdentity,
  existIdentity,
  generateUserIdentity
} from '@/interceptors/identity'
import { buildCardActivationEvent, buildIdentityEvent } from '@/lib/events'
import { UserIdentity } from '@/types/identity'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import useErrors, { IUseErrors } from './useErrors'
import { requestCardActivation } from '@/interceptors/card'
import { regexUserName } from '@/constants/constants'

export interface AccountProps {
  nonce: string
  card: string
  name: string
}

interface CreateIdentityParams extends AccountProps {
  isValidNonce: boolean
  loading: boolean
}

export type CreateIdentityReturns = {
  success: boolean
  message: string
  identity?: UserIdentity
}

export type UseIdentityReturns = {
  loading: boolean
  accountInfo: CreateIdentityParams
  setAccountInfo: Dispatch<SetStateAction<CreateIdentityParams>>
  errors: IUseErrors
  handleChangeUsername: (username: string) => void
  handleCreateIdentity: (props: AccountProps) => void
}

let checkExistUsername: NodeJS.Timeout

const defaultAccount = {
  nonce: '',
  card: '',
  name: '',
  isValidNonce: false,
  loading: true
}

export const useCreateIdentity = (): UseIdentityReturns => {
  const { setUserIdentity } = useContext(LaWalletContext)
  const [loading, setLoading] = useState<boolean>(false)

  const [accountInfo, setAccountInfo] =
    useState<CreateIdentityParams>(defaultAccount)

  const errors = useErrors()
  const router = useRouter()

  const validateUsername = (username: string) => {
    const invalidUsername = !regexUserName.test(username)

    if (invalidUsername) {
      errors.modifyError('INVALID_USERNAME')
      return false
    }
    return true
  }

  const checkIfExistName = (username: string) => {
    if (checkExistUsername) clearTimeout(checkExistUsername)

    checkExistUsername = setTimeout(async () => {
      const nameWasTaken = await existIdentity(username)

      setAccountInfo(prev => {
        return { ...prev, loading: false }
      })

      if (nameWasTaken) {
        errors.modifyError('NAME_ALREADY_TAKEN')
        return false
      }
    }, 300)
  }

  const handleChangeUsername = (username: string) => {
    errors.resetError()

    if (!username.length && accountInfo.name.length) {
      setAccountInfo({ ...accountInfo, name: '', loading: false })
      if (checkExistUsername) clearTimeout(checkExistUsername)
      return
    }

    const validUsername: boolean = validateUsername(username)
    if (validUsername) {
      setAccountInfo({
        ...accountInfo,
        name: username.toLowerCase(),
        loading: true
      })

      checkIfExistName(username)
    }
  }

  const createNostrAccount = async () => {
    setLoading(true)

    const generatedIdentity: UserIdentity = await generateUserIdentity('', '')
    if (generatedIdentity) {
      setUserIdentity(generatedIdentity)
      router.push('/dashboard')
      setLoading(false)
    }
  }

  const createIdentity = async ({
    nonce,
    name
  }: AccountProps): Promise<CreateIdentityReturns> => {
    const generatedIdentity: UserIdentity = await generateUserIdentity(
      nonce,
      name
    )

    try {
      const event: NostrEvent = await buildIdentityEvent(
        nonce,
        generatedIdentity
      )
      const createdAccount: IdentityResponse = await claimIdentity(event)
      if (!createdAccount.success)
        return {
          success: false,
          message: createdAccount.reason!
        }

      return {
        success: true,
        message: 'ok',
        identity: generatedIdentity
      }
    } catch {
      return {
        success: false,
        message: 'ERROR_ON_CREATE_ACCOUNT'
      }
    }
  }

  const handleCreateIdentity = (props: AccountProps) => {
    if (loading) return
    const { nonce, name } = props

    if (!nonce) {
      createNostrAccount()
      return
    }

    if (!name.length) return errors.modifyError('EMPTY_USERNAME')
    if (name.length > 15) return errors.modifyError('MAX_LENGTH_USERNAME')

    if (!regexUserName.test(name)) return errors.modifyError('INVALID_USERNAME')

    setLoading(true)

    existIdentity(name)
      .then((nameWasTaken: boolean) => {
        if (nameWasTaken) return errors.modifyError('NAME_ALREADY_TAKEN')

        return createIdentity(props).then(
          (new_identity: CreateIdentityReturns) => {
            const { success, identity, message } = new_identity

            if (success && identity) {
              setUserIdentity(identity!)

              if (props.card) {
                buildCardActivationEvent(props.card, identity.privateKey)
                  .then((cardEvent: NostrEvent) => {
                    requestCardActivation(cardEvent).then(() => {
                      router.push('/dashboard')
                    })
                  })
                  .catch(() => {
                    router.push('/dashboard')
                  })
              } else {
                router.push('/dashboard')
              }
            } else {
              errors.modifyError(message)
            }
          }
        )
      })
      .then(() => setLoading(false))
  }
  return {
    accountInfo,
    setAccountInfo,
    handleCreateIdentity,
    handleChangeUsername,
    loading,
    errors
  }
}
