import {Client, GatewayIntentBits} from "discord.js";

class DiscordService {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.MessageContent
    ]
  });

  async register() {
    this.client.once('ready', () => {
      console.log(`Discord logged in as ${this.client.user.tag}`);
    });

    this.client.on('threadCreate', (thread) => {
      if (thread.name.startsWith('!bind_project')) {
        const channel = thread.parent.name;
        thread.send(`Yes, you're binding gitlab project to ${channel} channel?`);
      }
    })

    // this.client.on('messageCreate', (message) => {
    //   const author = message.author;
    //   const
    // })

    return this.client.login(process.env.DISCORD_TOKEN);
  }
}

export default new DiscordService();
