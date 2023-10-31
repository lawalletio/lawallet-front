'use client'

import { useState, useEffect, ReactNode } from 'react'
import { faSort, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Flex from '../Flex'
import Icon from '../Icon'
import TokenInfo from '../TokenInfo'

import theme from '@/styles/theme'
import { Combobox, Trigger, Content, Group, Item } from './style'

interface ItemListCombobox {
  id: number
  label: string
  symbol: string
}

interface ComponentProps {
  children?: ReactNode
  selected: number
  list: Array<ItemListCombobox>
  onChange: (id: number) => void
  showPrice?: boolean
}

export default function Component(props: ComponentProps) {
  const { children, selected, list, onChange, showPrice = false } = props

  const [open, setOpen] = useState(false)
  const [select, setSelect] = useState(0)

  useEffect(() => {
    setSelect(selected)
  }, [selected])

  const handleClick = (id: number) => {
    setSelect(id)
    onChange(id)
    setOpen(false)
  }

  return (
    <Combobox $isSelected={select !== 0}>
      <Trigger onClick={() => setOpen(!open)} className="trigger">
        <Flex align="center" flex={1} gap={8}>
          <Flex flex={1}>
            {select ? (
              <TokenInfo
                item={list.find(item => item.id === select)}
                showPrice={showPrice}
              />
            ) : (
              children
            )}
          </Flex>
          <Icon size="small">
            <FontAwesomeIcon
              icon={faSort}
              color={open ? theme.colors.text : theme.colors.gray30}
            />
          </Icon>
        </Flex>
      </Trigger>
      {list && list.length > 0 && (
        <Content $isOpen={open}>
          <Group>
            {list?.map(item => (
              <Item
                key={item.id}
                tabIndex={open ? 0 : -1}
                onClick={() => handleClick(item.id)}
              >
                <TokenInfo item={item} />
                {select === item.id && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={theme.colors.primary}
                  />
                )}
              </Item>
            ))}
          </Group>
        </Content>
      )}
    </Combobox>
  )
}
