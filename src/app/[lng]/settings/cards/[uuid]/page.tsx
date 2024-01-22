'use client'
import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { MainLoader } from '@/components/Loader/Loader'
import {
  Button,
  Divider,
  Flex,
  InputGroup,
  InputGroupRight,
  InputWithLabel,
  Text
} from '@/components/UI'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import useCardConfig from '@/hooks/useCardConfig'
import { formatToPreference } from '@/lib/utils/formatter'
import { useParams, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

const page = () => {
  const { t, lng } = useTranslation()

  const { converter, configuration } = useLaWalletContext()
  const { cardsData, cardsConfig, loadInfo } = useCardConfig()

  const router = useRouter()
  const params = useParams()

  const uuid: string = useMemo(() => params.uuid as string, [])
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
            name="card-name"
            label={t('NAME')}
            placeholder={t('NAME')}
            value={cardsData[uuid].design.name}
          />

          <Divider y={24} />

          <InputGroup>
            <InputWithLabel
              name="max-amount"
              label={t('MAX_AMOUNT')}
              placeholder="0"
              value={formatToPreference(
                configuration.props.currency,
                converter.convertCurrency(
                  Number(cardsConfig.cards?.[uuid].limits[0].amount) / 1000,
                  'SAT',
                  configuration.props.currency
                ),
                lng
              )}
            />

            <InputGroupRight>
              <Text size="small">{configuration.props.currency}</Text>
            </InputGroupRight>
          </InputGroup>

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
            <Button onClick={() => null}>{t('SAVE')}</Button>
          </Flex>
          <Divider y={32} />
        </Container>
      </Flex>
    </>
  )
}

export default page
