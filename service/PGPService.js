import PGPKeyFactory from "../factory/PGPKeyFactory.js"
import { createMessage, decrypt, readMessage, encrypt} from "openpgp"
import messages from "../assets/json/messages.json" assert { type: 'json' }

class PGPService {
    static {
        PGPKeyFactory.generateEncryptionKeys().then(val => {
            [this.publicKey, this.privateKey] = val;
        })
    }

    static generateEncryptedText = async (interaction) => {
        return await encrypt({ message: await createMessage({ text: await interaction.options.getString("text") }), 
            encryptionKeys: [this.publicKey], signingKeys: [this.privateKey] })
    }
  
    static generateDecryptedText = async (interaction) => {
        let message = await readMessage({ armoredMessage: this.formatEncryptedText(interaction) })
        let {data: decryptedText, signatures} = await decrypt({ message: message, 
            verificationKeys: this.publicKey, decryptionKeys: this.privateKey })
        if(!signatures[0].verified){
            return `${messages.error.key.prefix} ${messages.error.key.badSignature}`
        }
        return decryptedText
    }
  
    static formatEncryptedText = (interaction) => {
        return interaction.options.getString("text").replaceAll(" ", "").replace("BEGINPGPMESSAGE", "BEGIN PGP MESSAGE")
        .replace("ENDPGPMESSAGE", "END PGP MESSAGE").replace("MESSAGE-----", "MESSAGE-----\n\n").replace("-----END", "\n\n-----END")
    }
}

export default PGPService