import { ClearCharacterIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import { Flex, Button } from '@/components/UI'
import { IUseNumpad } from '@/hooks/useNumpad'
import { useEffect } from 'react'

const timeOut: Record<string, NodeJS.Timeout> = {}
type KeyboardProps = {
  numpadData: IUseNumpad
  disableKeydown?: boolean
}

export default function Component({
  numpadData,
  disableKeydown = false
}: KeyboardProps) {
  const { handleNumpad, intAmount, resetAmount, concatNumber, deleteNumber } =
    numpadData

  const handleDeleteOnMouseDown = () =>
    (timeOut.reset = setTimeout(() => resetAmount(), 500))

  const handleDeleteOnMouseUp = () => clearTimeout(timeOut?.reset)

  useEffect(() => {
    if (!disableKeydown) {
      document.addEventListener('keydown', handleKeyPress)

      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [intAmount, disableKeydown])

  const handleKeyPress = (e: KeyboardEvent) => {
    const { key } = e
    const keysAccepted: string[] = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]

    if (key == 'Backspace') deleteNumber()
    if (keysAccepted.includes(key)) concatNumber(key)
  }

  return (
    <Flex direction="column" gap={8}>
      <Flex gap={8}>
        <Button variant="borderless" onClick={() => handleNumpad('1')}>
          1
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('2')}>
          2
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('3')}>
          3
        </Button>
      </Flex>
      <Flex gap={8}>
        <Button variant="borderless" onClick={() => handleNumpad('4')}>
          4
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('5')}>
          5
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('6')}>
          6
        </Button>
      </Flex>
      <Flex gap={8}>
        <Button variant="borderless" onClick={() => handleNumpad('7')}>
          7
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('8')}>
          8
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('9')}>
          9
        </Button>
      </Flex>
      <Flex gap={8}>
        <Button variant="borderless" onClick={() => handleNumpad('00')}>
          00
        </Button>
        <Button variant="borderless" onClick={() => handleNumpad('0')}>
          0
        </Button>
        <Button
          onTouchStart={handleDeleteOnMouseDown}
          onTouchEnd={handleDeleteOnMouseUp}
          onMouseDown={handleDeleteOnMouseDown}
          onMouseUp={handleDeleteOnMouseUp}
          variant="borderless"
          color="error"
          onClick={deleteNumber}
        >
          <ClearCharacterIcon />
        </Button>
      </Flex>
    </Flex>
  )
}
