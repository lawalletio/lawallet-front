import assert from 'assert'
import { bech32 } from 'bech32'

const rules = {
  prefix: 'lnurl',
  limit: 1023
}

const decode = (encoded: string) => {
  assert.strictEqual(
    typeof encoded,
    'string',
    'Invalid argument ("encoded"): String expected'
  )
  const decoded = bech32.decode(encoded, rules.limit)
  return Buffer.from(bech32.fromWords(decoded.words)).toString('utf8')
}

const encode = (unencoded: string) => {
  assert.strictEqual(
    typeof unencoded,
    'string',
    'Invalid argument ("unencoded"): String expected'
  )

  const words = bech32.toWords(Buffer.from(unencoded, 'utf8'))
  return bech32.encode(rules.prefix, words, rules.limit)
}

export default {
  decode,
  encode
}
