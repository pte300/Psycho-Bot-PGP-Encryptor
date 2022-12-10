import { generateKey, readKey, readPrivateKey, decryptKey } from "openpgp"
import config from "../../config.json" assert { type: 'json' }

class PGPKeyFactory {

    static generateEncryptionKeys = async () => {
        const generatedkey = await generateKey({
          curve: config.defaultCurve,
          userIDs: [
            {
              name: config.defaultName,
              email: config.defaultEmail,
            },
          ],
          passphrase: config.defaultPassphrase
        });

        return [
            await readKey({ armoredKey: generatedkey.publicKey }),
            await decryptKey({ privateKey: await readPrivateKey({ armoredKey: generatedkey.privateKey }), passphrase: config.defaultPassphrase })
        ]
      }
}

export default PGPKeyFactory