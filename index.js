import { Client, Events, GatewayIntentBits } from "discord.js"
import InteractionService from "./service/InteractionService.js"
import config from "../config.json" assert { type: 'json'}
import fs from "fs"
import CommandService from "./service/CommandService.js"

//Todo: Add params to customize curve/passphrase for key generation
//Todo: Add function to create default config file in case of none existing.
//TODO: Move Encryption and Decryption options into new objects

class App{
    static async run(){
        
        if(!fs.existsSync("../config.json")){
            fs.writeFileSync("../config.json", JSON.stringify(
                {
                    "token": null,
                    "defaultPassphrase": "examplepassphrase",
                    "defaultName": null,
                    "defaultEmail": null,
                    "defaultCurve": "curve25519",
                    "defaultPermissionRole": null,
                    "applicationID": null
                }                
            ))
        }

        CommandService.register();

        const client = new Client({ intents: [GatewayIntentBits.Guilds] })
        client.on(Events.InteractionCreate, async (interaction) => { await InteractionService.run(interaction) })
        client.login(config.token)
    }
}

await App.run()