import { Avatar, Flex, Text } from '@/components/UI'
import React from 'react'

const RecipientElement = ({ lud16 }: { lud16: string }) => {
  const [username, domain] = lud16.split('@')
  return (
    <Flex align="center" gap={8}>
      <Avatar>
        <Text size="small">{username.substring(0, 2).toUpperCase()}</Text>
      </Avatar>
      <Flex align="center">
        <Text>{username}</Text>
        <Text>@{domain}</Text>
      </Flex>
    </Flex>
  )
}

export default RecipientElement
