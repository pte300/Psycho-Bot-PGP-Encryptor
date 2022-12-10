import config from "../../config.json" assert { type: 'json'}
import commands from "../assets/json/commands.json" assert { type: 'json'}
import messages from "../assets/json/messages.json" assert { type: 'json' }
import PGPService from "./PGPService.js"

class InteractionService {

  static hasDecryptPermission = (interaction) => {
    return (config.defaultPermissionRole==null || interaction.member.roles.cache.some(role => role.name === config.defaultPermissionRole))
  }

  static async run(interaction){

      // * ENCRYPT FUNCTION HANDLER
      if (interaction.commandName === commands.slashcommands.encrypt.name) {
        try {
          await interaction.reply({ ephemeral: true, content: await PGPService.generateEncryptedText(interaction)})
        } catch(e) {
          console.log(e)
          await interaction.reply(`${messages.error.text.prefix} ${messages.error.text.badClearText}`);
        }
    
      } else if (interaction.commandName === commands.slashcommands.decrypt.name) {
        if(this.hasDecryptPermission(interaction) === false){ 
          return await interaction.reply(`${messages.error.permission.prefix} ${messages.error.permission.noPermissionRole}`);
        } else {
          try {
            await interaction.reply({ephemeral: true, content: await PGPService.generateDecryptedText(interaction)})
          } catch (e) {
            await interaction.reply(`${messages.error.text.prefix} ${messages.error.text.badEncryptedText}`);
          }
        }
      }
  }
}

export default InteractionService;