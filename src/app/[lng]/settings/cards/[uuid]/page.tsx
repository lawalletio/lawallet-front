'use client'
import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { MainLoader } from '@/components/Loader/Loader'
import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  InputWithLabel,
  Label
} from '@/components/UI'
import { useTranslation } from '@/context/TranslateContext'
import useCardConfig from '@/hooks/useCardConfig'
import { CardPayload, CardStatus, Limit } from '@/types/card'
import { useParams, useRouter } from 'next/navigation'
import React, {
  ChangeEvent,
  ChangeEventHandler,
  EventHandler,
  useEffect,
  useMemo,
  useState
} from 'react'
import LimitInput from '../components/LimitInput/LimitInput'
import { useLaWalletContext } from '@/context/LaWalletContext'

const defaultTXLimit: Limit = {
  name: 'Transactional limit',
  description: 'Spending limit per transaction',
  token: 'BTC',
  amount: BigInt(100000000000).toString(),
  delta: 0
}

const defaultDailyLimit: Limit = {
  name: 'Daily limit',
  description: 'Spending limit per day',
  token: 'BTC',
  amount: BigInt(1000000000).toString(),
  delta: 86400
}

type LimtisConfigOptions = 'tx' | 'daily'

const page = () => {
  const { t } = useTranslation()
  const [showLimit, setShowLimit] = useState<LimtisConfigOptions>('tx')
  const { configuration, converter } = useLaWalletContext()

  const [newConfig, setNewConfig] = useState<CardPayload>({
    name: '',
    description: '',
    status: CardStatus.ENABLED,
    limits: [defaultTXLimit, defaultDailyLimit]
  })

  const { cardsData, cardsConfig, loadInfo, updateCardConfig } = useCardConfig()

  const router = useRouter()
  const params = useParams()

  const uuid: string = useMemo(() => params.uuid as string, [])

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const name: string = e.target.value

    setNewConfig({
      ...newConfig,
      name
    })
  }

  const handleChangeLimit = (e: ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value)
    const newLimits: Limit[] = newConfig.limits.slice()
    newLimits[showLimit === 'tx' ? 0 : 1].amount = BigInt(
      converter.convertCurrency(
        newAmount * 1000,
        configuration.props.currency,
        'SAT'
      )
    ).toString()

    setNewConfig({
      ...newConfig,
      limits: newLimits
    })
  }

  useEffect(() => {
    if (!cardsConfig.cards?.[uuid] || !cardsData?.[uuid]) return
    const { name, description, status, limits } = cardsConfig.cards[uuid]

    const txLimit = limits.find((limit: Limit) => {
      if (limit.delta === defaultTXLimit.delta) return limit
    })

    const dailyLimit = limits.find((limit: Limit) => {
      if (limit.delta === defaultDailyLimit.delta) return limit
    })

    setNewConfig({
      name,
      description,
      status,
      limits: [txLimit ?? defaultTXLimit, dailyLimit ?? defaultDailyLimit]
    })
  }, [cardsConfig.cards])

  if (!loadInfo.loading && !cardsData?.[uuid]) return null

  return (
    <>
      <Navbar
        showBackPage={true}
        title={loadInfo.loading ? t('LOADING') : cardsData[uuid].design.name}
        overrideBack="/settings/cards"
      />

      {loadInfo.loading ? (
        <MainLoader />
      ) : (
        <Container>
          <Divider y={24} />
          <InputWithLabel
            onChange={handleChangeName}
            name="card-name"
            label={t('NAME')}
            placeholder={t('NAME')}
            value={newConfig.name}
          />

          <Divider y={24} />

          <Label htmlFor="max-amount">{t('LIMITS')}</Label>

          <Flex direction="row" align="end">
            <ButtonGroup>
              <Button onClick={() => setShowLimit('tx')} size="small">
                {t('UNIQUE')}
              </Button>

              <Button onClick={() => setShowLimit('daily')} size="small">
                {t('DAILY')}
              </Button>
            </ButtonGroup>
          </Flex>

          <LimitInput
            onChange={handleChangeLimit}
            amount={
              Number(newConfig.limits[showLimit === 'tx' ? 0 : 1].amount) / 1000
            }
          />

          <Divider y={24} />
        </Container>
      )}

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex gap={8}>
            <Button
              variant="bezeledGray"
              onClick={() => router.push('/settings/cards')}
            >
              {t('CANCEL')}
            </Button>
            <Button onClick={() => updateCardConfig(uuid, newConfig)}>
              {t('SAVE')}
            </Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}

export default page
