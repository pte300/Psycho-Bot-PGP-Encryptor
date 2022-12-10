import config from '../../config.json' assert { type: 'json'}
import messages from '../assets/json/messages.json' assert { type: 'json'}
import commands from "../assets/json/commands.json" assert { type: 'json'}
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

class CommandService {
  static rest = new REST({ version: '9' }).setToken(config.token);

  static register = async () => {
    try {
      console.log(`${messages.command.register.prefix} ${messages.command.register.start}`);

      await this.rest.put(Routes.applicationCommands(config.applicationID), 
        { body: [commands.slashcommands.encrypt, commands.slashcommands.decrypt] });

      console.log(`${messages.command.register.prefix} ${messages.command.register.success}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export default CommandService