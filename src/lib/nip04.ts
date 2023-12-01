import { NostrEvent } from '@nostr-dev-kit/ndk'
import { nip04 } from 'nostr-tools'
import { nowInSeconds } from './utils'
import {
  Cipher,
  Decipher,
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'crypto'

/**
 * An interface representing the general structure of the JSON-encoded content of a Multi-NIP-04 event
 *
 * In this interface's description, MESSAGE stands for the message to communicate, and
 * RANDOM_MESSAGE_KEY is a uniformly random symmetric key used specifically for the message in question.
 *
 */
export interface MultiNip04Content {
  mac: string // hash of MESSAGE, in base64
  enc: string // encryption of MESSAGE with RANDOM_MESSAGE_KEY, as a NIP-04 content
  key: { [pk: string]: string } // encryption of RANDOM_MESSAGE_KEY with public key "pk" in HEX, as a NIP-04 content
  alg: string // algorithm collection description
}

/**
 * Encrypt the given message using AES-128-CBC and return a "NIP-04 like" string
 *
 * This function will generate a random IV and use the given message and key to return a string of the form:
 *
 *   BASE4_ENCODE(<CIPHERTEXT>)?iv=BASE64_ENCODE(<IV>)
 *
 * Where:
 *
 *   - BASE64_ENCODE(): is a function performing the base64 encoding of its given binary argument
 *
 * Note that this is the same format used by NIP-04.
 *
 *
 * @param keyHex  HEX-encoding of the symmetric key to use
 * @param message   The UTF-8 message to encrypt
 * @returns  A "NIP-04 like" string as described above
 */
function doEncryptNip04Like(keyHex: string, message: string): string {
  const iv: Uint8Array = Uint8Array.from(randomBytes(16))
  const cipher: Cipher = createCipheriv(
    'aes128',
    Buffer.from(keyHex, 'hex'),
    iv
  )
  return (
    Buffer.from([
      ...cipher.update(Buffer.from(message, 'utf8')),
      ...cipher.final()
    ]).toString('base64') + `?iv=${Buffer.from(iv).toString('base64')}`
  )
}

/**
 * Decrypt the given "NIP-04 like" ciphertext using AES-128-CBC and return the decrypted message
 *
 * This function will accept a string of the form:
 *
 *   BASE4_ENCODE(<CIPHERTEXT>)?iv=BASE64_ENCODE(<IV>)
 *
 * Where:
 *
 *   - BASE64_ENCODE(): is a function performing the base64 encoding of its given binary argument.
 *
 * It will then extract the IV in order to decrypt the CYPHERTEXT part.
 *
 *
 * @param keyHex  HEX-encoding of the symmetric key to use
 * @param message  The "NIP-04 like" message to decrypt
 * @returns  The UTF-8 string corresponding to the deciphered plaintext
 */
function doDecryptNip04Like(keyHex: string, message: string): string {
  const re: RegExpExecArray | null =
    /^(?<ciphertext>[^?]*)\?iv=(?<iv>.*)$/.exec(message)
  if (null === re) {
    throw new Error('Malformed message')
  }
  const decipher: Decipher = createDecipheriv(
    'aes128',
    Buffer.from(keyHex, 'hex'),
    Buffer.from(re.groups?.iv ?? '', 'base64')
  )
  return Buffer.from([
    ...decipher.update(Buffer.from(re.groups?.ciphertext ?? '', 'base64')),
    ...decipher.final()
  ]).toString('utf8')
}

/**
 * Build a "Multi NIP-04" event, communicating the given message from the given sender to the given list of receivers
 *
 * A "Multi NIP-04" event is a generalization of a NIP-04 event intended to allow a single sender to send the same
 * message to several receivers, whilst ensuring that they all receive the same message, and none other than them
 * can decrypt the transmitted plaintext.
 *
 * The structure of a "Multi NIP-04" event is as follows:
 *
 *   {
 *     ...
 *     "pubkey": HEX_ENCODE(<SENDER_PUBLIC_KEY>),
 *     "created_at": <CURRENT_TIMESTAMP>,
 *     "tags": [
 *       ["p", HEX_ENCODE(<RECEIVER_1_PUBLIC_KEY>)],
 *       ["p", HEX_ENCODE(<RECEIVER_2_PUBLIC_KEY>)],
 *       ...
 *       ["p", HEX_ENCODE(<RECEIVER_N_PUBLIC_KEY>)]
 *     ],
 *     "content": <CONTENT>,
 *     ...
 *   }
 *
 * Where N is the number of receivers.
 * In its turn, the CONTENT is the JSON serialization of the following object:
 *
 *   {
 *     "mac": BASE64_ENCODE(SHA256(<MESSAGE>)),
 *     "enc": NIP04LIKE_ENCRYPT(<MESSAGE>, <RANDOM_MESSAGE_KEY>),
 *     "key": {
 *       HEX_ENCODE(<RECEIVER_1_PUBLIC_KEY>): NIP04_ENCRYPT(<SENDER_PRIVATE_KEY>, <RECEIVER_1_PUBLIC_KEY>, HEX_ENCODE(<RANDOM_MESSAGE_KEY>)),
 *       HEX_ENCODE(<RECEIVER_2_PUBLIC_KEY>): NIP04_ENCRYPT(<SENDER_PRIVATE_KEY>, <RECEIVER_2_PUBLIC_KEY>, HEX_ENCODE(<RANDOM_MESSAGE_KEY>)),
 *       ...
 *       HEX_ENCODE(<RECEIVER_N_PUBLIC_KEY>): NIP04_ENCRYPT(<SENDER_PRIVATE_KEY>, <RECEIVER_N_PUBLIC_KEY>, HEX_ENCODE(<RANDOM_MESSAGE_KEY>))
 *     },
 *     "alg": "sha256:nip-04:nip-04"
 *   }
 *
 * Where:
 *
 *   - HEX_ENCODE(): is a function performing the byte-by-byte hex encoding of its given binary argument
 *   - BASE64_ENCODE(): is a function performing the base64 encoding of its given binary argument
 *   - SHA256(): is a function calculating the SHA-256 hash of its given binary argument
 *   - NIP04_ENCRYPT(): is a function applying the standard NIP-04 encryption
 *   - NIP04LIKE_ENCRYPT(): is a function generating the same output as NIP04_ENCRYPT, but using the given symmetric key
 *         instead of deriving a shared secret from the sender's private key and the recipient's public key
 *
 * Note that a fixed-length (ie. 16 bytes) random message key is used to encrypt the message itself (RANDOM_MESSAGE_KEY in the
 * explanation above), and said key is then itself encrypted under each receiver's public key in turn.
 * Additionally, the function of the ".mac" field is to ensure that all recipients may check each received the same message.
 * Finally, the ".alg" field is provided for future extension.
 *
 * In order to parse a "Multi NIP-04" event, consider the following event:
 *
 *   {
 *     ...
 *     "pubkey": HEX_ENCODE(<SENDER_PUBLIC_KEY>),
 *     ...
 *     "tags": [
 *       ...
 *       ["p", HEX_ENCODE(<RECEIVER_PUBLIC_KEY>)],
 *       ...
 *     ],
 *     "content": <CONTENT>,
 *     ...
 *   }
 *
 * And let the JSON-decoded <CONTENT> be:
 *
 *   {
 *     "mac": <MAC>,
 *     "enc": <ENC>,
 *     "key": {
 *       ...
 *       HEX_ENCODE(<RECEIVER_PUBLIC_KEY>): <ENCRYPTED_MESSAGE_KEY>,
 *       ...
 *     },
 *     "alg": "sha256:nip-04:nip-04"
 *   }
 *
 * Now proceed as follows:
 *
 *   1. Calculate MESSAGE_KEY as NIP04_DECRYPT(<RECEIVER_PRIVATE_KEY>, <SENDER_PUBLIC_KEY>, <ENCRYPTED_MESSAGE_KEY>)
 *   2. Parse <ENC> as <ENC_CIPHERTEXT>?iv=<ENC_IV>
 *   3. Calculate PLAINTEXT as AES128_CBC(<MESSAGE_KEY>, <ENC_IV>, <ENC_CIPHERTEXT>)
 *   4. Calculate PLAINTEXT_MAC as SHA256(<PLAINTEXT>)
 *   5. Verify BASE64_ENCODE(<PLAINTEXT_MAC>) equals <MAC>
 *   6. Return <PLAINTEXT>
 *
 *
 * @param message  The message to encrypt
 * @param senderSecKeyHex  The sender's secret key (SENDER_PRIVATE_KEY in the explanation above), as a HEX string
 * @param senderPubKeyHex  The sender's public key (SENDER_PUBLIC_KEY in the explanation above), as a HEX string
 * @param receiverPubKeysHex  An array of HEX-encoded recipient public keys (RECEIVER_*_PUBLIC_KEY in the explanation above)
 * @returns  A NOSTR event lacking ".id" and ".sig" fields
 */
export async function buildMultiNip04Event(
  message: string, // UTF-8 message to send
  senderSecKeyHex: string, // HEX sender secret key
  senderPubKeyHex: string, // HEX sender public key
  receiverPubKeysHex: string[] // HEX receivers public keys
): Promise<NostrEvent> {
  const macBase64: string = createHash('sha256')
    .update(message)
    .digest()
    .toString('base64')

  const randomMessageKeyHex: string = Buffer.from(randomBytes(16)).toString(
    'hex'
  )

  const encryptedContentNip04Like: string = doEncryptNip04Like(
    randomMessageKeyHex,
    message
  )

  const receiverPubKeysHexToNip04RandomMessageKey: { [pk: string]: string } =
    Object.fromEntries(
      await Promise.all(
        receiverPubKeysHex.map(
          async (pk: string): Promise<[string, string]> => [
            pk,
            await nip04.encrypt(senderSecKeyHex, pk, randomMessageKeyHex)
          ]
        )
      )
    )

  return {
    pubkey: senderPubKeyHex,
    created_at: nowInSeconds(),
    tags: receiverPubKeysHex.map((pk: string) => ['p', pk]),
    content: JSON.stringify({
      mac: macBase64,
      enc: encryptedContentNip04Like,
      key: receiverPubKeysHexToNip04RandomMessageKey,
      alg: 'sha256:nip-04:nip-04'
    })
  }
}

/**
 * Parse a "Multi NIP-04" event, validating the integrity of the decrypted message, and return the message's plaintext
 *
 * A "Multi NIP-04" event is a generalization of a NIP-04 event intended to allow a single sender to send the same
 * message to several receivers, whilst ensuring that they all receive the same message, and none other than them
 * can decrypt the transmitted plaintext.
 *
 * The structure of a "Multi NIP-04" event is as follows:
 *
 *   {
 *     ...
 *     "pubkey": HEX_ENCODE(<SENDER_PUBLIC_KEY>),
 *     "created_at": <CURRENT_TIMESTAMP>,
 *     "tags": [
 *       ["p", HEX_ENCODE(<RECEIVER_1_PUBLIC_KEY>)],
 *       ["p", HEX_ENCODE(<RECEIVER_2_PUBLIC_KEY>)],
 *       ...
 *       ["p", HEX_ENCODE(<RECEIVER_N_PUBLIC_KEY>)]
 *     ],
 *     "content": <CONTENT>,
 *     ...
 *   }
 *
 * Where N is the number of receivers.
 * In its turn, the CONTENT is the JSON serialization of the following object:
 *
 *   {
 *     "mac": BASE64_ENCODE(SHA256(<MESSAGE>)),
 *     "enc": NIP04LIKE_ENCRYPT(<MESSAGE>, <RANDOM_MESSAGE_KEY>),
 *     "key": {
 *       HEX_ENCODE(<RECEIVER_1_PUBLIC_KEY>): NIP04_ENCRYPT(<SENDER_PRIVATE_KEY>, <RECEIVER_1_PUBLIC_KEY>, HEX_ENCODE(<RANDOM_MESSAGE_KEY>)),
 *       HEX_ENCODE(<RECEIVER_2_PUBLIC_KEY>): NIP04_ENCRYPT(<SENDER_PRIVATE_KEY>, <RECEIVER_2_PUBLIC_KEY>, HEX_ENCODE(<RANDOM_MESSAGE_KEY>)),
 *       ...
 *       HEX_ENCODE(<RECEIVER_N_PUBLIC_KEY>): NIP04_ENCRYPT(<SENDER_PRIVATE_KEY>, <RECEIVER_N_PUBLIC_KEY>, HEX_ENCODE(<RANDOM_MESSAGE_KEY>))
 *     },
 *     "alg": "sha256:nip-04:nip-04"
 *   }
 *
 * Where:
 *
 *   - HEX_ENCODE(): is a function performing the byte-by-byte hex encoding of its given binary argument
 *   - BASE64_ENCODE(): is a function performing the base64 encoding of its given binary argument
 *   - SHA256(): is a function calculating the SHA-256 hash of its given binary argument
 *   - NIP04_ENCRYPT(): is a function applying the standard NIP-04 encryption
 *   - NIP04LIKE_ENCRYPT(): is a function generating the same output as NIP04_ENCRYPT, but using the given symmetric key
 *         instead of deriving a shared secret from the sender's private key and the recipient's public key
 *
 * Note that a fixed-length (ie. 16 bytes) random message key is used to encrypt the message itself (RANDOM_MESSAGE_KEY in the
 * explanation above), and said key is then itself encrypted under each receiver's public key in turn.
 * Additionally, the function of the ".mac" field is to ensure that all recipients may check each received the same message.
 * Finally, the ".alg" field is provided for future extension.
 *
 * In order to parse a "Multi NIP-04" event, consider the following event:
 *
 *   {
 *     ...
 *     "pubkey": HEX_ENCODE(<SENDER_PUBLIC_KEY>),
 *     ...
 *     "tags": [
 *       ...
 *       ["p", HEX_ENCODE(<RECEIVER_PUBLIC_KEY>)],
 *       ...
 *     ],
 *     "content": <CONTENT>,
 *     ...
 *   }
 *
 * And let the JSON-decoded <CONTENT> be:
 *
 *   {
 *     "mac": <MAC>,
 *     "enc": <ENC>,
 *     "key": {
 *       ...
 *       HEX_ENCODE(<RECEIVER_PUBLIC_KEY>): <ENCRYPTED_MESSAGE_KEY>,
 *       ...
 *     },
 *     "alg": "sha256:nip-04:nip-04"
 *   }
 *
 * Now proceed as follows:
 *
 *   1. Calculate MESSAGE_KEY as NIP04_DECRYPT(<RECEIVER_PRIVATE_KEY>, <SENDER_PUBLIC_KEY>, <ENCRYPTED_MESSAGE_KEY>)
 *   2. Parse <ENC> as <ENC_CIPHERTEXT>?iv=<ENC_IV>
 *   3. Calculate PLAINTEXT as AES128_CBC(<MESSAGE_KEY>, <ENC_IV>, <ENC_CIPHERTEXT>)
 *   4. Calculate PLAINTEXT_MAC as SHA256(<PLAINTEXT>)
 *   5. Verify BASE64_ENCODE(<PLAINTEXT_MAC>) equals <MAC>
 *   6. Return <PLAINTEXT>
 *
 *
 * @param event  The "Multi NIP-04" event to parse
 * @param receiverSecKeyHex  The receiver's secret key (RECEIVER_PRIVATE_KEY in the explanation above), as a HEX string
 * @param receiverPubKeyHex  The receiver's public key (RECEIVER_PUBLIC_KEY in the explanation above), as a HEX string
 * @returns  The decrypted message
 */
export async function parseMultiNip04Event(
  event: NostrEvent,
  receiverSecKeyHex: string,
  receiverPubKeyHex: string
): Promise<string> {
  if (
    !event.tags.some(
      (tag: string[]) =>
        (tag[0] ?? null) === 'p' && (tag[1] ?? null) === receiverPubKeyHex
    )
  ) {
    throw new Error('Receiver not in receivers list')
  }

  const rawContent = JSON.parse(event.content)

  if (!('mac' in rawContent)) {
    throw new Error('Malformed event content, missing "mac"')
  }
  if (!('enc' in rawContent)) {
    throw new Error('Malformed event content, missing "enc"')
  }
  if (!('key' in rawContent)) {
    throw new Error('Malformed event content, missing "key"')
  }
  if (!('alg' in rawContent)) {
    throw new Error('Malformed event content, missing "alg"')
  }

  if (typeof rawContent.mac !== 'string') {
    throw new Error('Malformed event content, "mac" should be a string')
  }
  if (typeof rawContent.enc !== 'string') {
    throw new Error('Malformed event content, "enc" should be a string')
  }
  if (typeof rawContent.key !== 'object') {
    throw new Error('Malformed event content, "key" should be an object')
  }
  if (typeof rawContent.alg !== 'string') {
    throw new Error('Malformed event content, "alg" should be a string')
  }

  if (rawContent.alg !== 'sha256:nip-04:nip-04') {
    throw new Error(
      'Malformed event content, "alg" expected to be "sha256:nip-04:nip-04"'
    )
  }

  if (
    !Object.entries(rawContent.key ?? {}).every(
      (entry: [string, any]): boolean =>
        typeof entry[1] === 'string' && /^[^?]*\?iv=.*$/.test(entry[1])
    )
  ) {
    throw new Error(
      'Malformed event content, "key" values should be strings of the form "{content}?iv={iv}"'
    )
  }

  const content: MultiNip04Content = rawContent as MultiNip04Content

  const messageKeyHex: string = await nip04.decrypt(
    receiverSecKeyHex,
    event.pubkey,
    content.key[receiverPubKeyHex]
  )

  const decryptedMessage: string = doDecryptNip04Like(
    messageKeyHex,
    content.enc
  )

  const macBase64: string = createHash('sha256')
    .update(decryptedMessage)
    .digest()
    .toString('base64')

  if (content.mac !== macBase64) {
    throw new Error('MAC mismatch')
  }

  return decryptedMessage
}
