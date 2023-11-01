import { LaWalletContext } from '@/context/LaWalletContext'
import {
  IdentityResponse,
  claimIdentity,
  existIdentity,
  generateUserIdentity
} from '@/interceptors/identity'
import { identityEvent } from '@/lib/events'
import { UserIdentity } from '@/types/identity'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import useErrors, { IUseErrors } from './useErrors'

export interface AccountProps {
  nonce: string
  card: string
  name: string
}

export type CreateIdentityReturns = {
  success: boolean
  message: string
  identity?: UserIdentity
}

export type UseIdentityReturns = {
  loading: boolean
  errors: IUseErrors
  handleCreateIdentity: (props: AccountProps) => void
}

export const regexUserName: RegExp = /^[A-Za-z0123456789]+$/

export const useCreateIdentity = (): UseIdentityReturns => {
  const { setUserIdentity } = useContext(LaWalletContext)
  const [loading, setLoading] = useState<boolean>(false)

  const errors = useErrors()
  const router = useRouter()

  const createIdentity = async ({
    nonce,
    name
  }: AccountProps): Promise<CreateIdentityReturns> => {
    const generatedIdentity: UserIdentity = await generateUserIdentity(
      nonce,
      name
    )

    const event: NostrEvent = await identityEvent(nonce, generatedIdentity)
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
  }

  const handleCreateIdentity = (props: AccountProps) => {
    if (loading) return
    const { nonce, name } = props

    if (!nonce) return errors.modifyError('INVALID_NONCE')
    if (!name.length) return errors.modifyError('EMPTY_USERNAME')
    if (name.length > 15) return errors.modifyError('MAX_LENGTH_USERNAME')

    if (!regexUserName.test(name)) return errors.modifyError('INVALID_USERNAME')

    setLoading(true)

    existIdentity(name)
      .then((nameWasTaken: boolean) => {
        if (nameWasTaken) return errors.modifyError('NAME_ALREADY_TAKEN')

        return createIdentity(props).then(
          (new_identity: CreateIdentityReturns) => {
            if (new_identity.success) {
              setUserIdentity(new_identity.identity!)
              router.push('/dashboard')
            } else {
              errors.modifyError(new_identity.message)
            }
          }
        )
      })
      .then(() => setLoading(false))
  }

  return { handleCreateIdentity, loading, errors }
}
