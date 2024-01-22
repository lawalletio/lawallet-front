'use client'

import { useTranslation } from '@/context/TranslateContext'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { MainLoader } from '@/components/Loader/Loader'
import { Divider, Flex } from '@/components/UI'
import useCardConfig from '@/hooks/useCardConfig'
import AddNewCardModal from './components/AddCard'
import DebitCard from './components/DebitCard'
import EmptyCards from './components/EmptyCards'

export default function Page() {
  const { cardsData, cardsConfig, loadInfo, toggleCardStatus } = useCardConfig()
  const { t } = useTranslation()

  return (
    <>
      <Navbar
        title={t('MY_CARDS')}
        showBackPage={true}
        overrideBack={'/settings'}
      />

      <Container size="small">
        <Divider y={16} />
        {loadInfo.loading ? (
          <MainLoader />
        ) : Object.keys(cardsData).length ? (
          <Flex direction="column" align="center" gap={16}>
            {Object.entries(cardsData).map(([key, value]) => {
              return (
                <DebitCard
                  card={{
                    uuid: key,
                    data: value,
                    config: cardsConfig.cards?.[key]
                  }}
                  toggleCardStatus={toggleCardStatus}
                  key={key}
                />
              )
            })}
          </Flex>
        ) : (
          <EmptyCards />
        )}
        <Divider y={16} />
      </Container>

      <AddNewCardModal />
    </>
  )
}
