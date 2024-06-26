import axios from "axios";
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  ThreadChannel,
} from "discord.js";

class DiscordService {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.MessageContent,
    ],
  });

  async register() {
    this.client.once("ready", () => {
      console.log(`Discord logged in as ${this.client.user.tag}`);
    });

    this.client.on("threadCreate", (thread) => {
      if (thread.name.startsWith("!bind_project")) {
        const channel = thread.parent.name;
        thread.send(
          `Yes, you're binding gitlab project to ${channel} channel?`
        );
      }
    });

    // this.client.on('messageCreate', (message) => {
    //   const author = message.author;
    //   const
    // })

    return this.client.login(process.env.DISCORD_TOKEN);
  }

  async createThread(
    channelId: string,
    threadName: string,
    content: string,
  ){
    const channel = await this.client.channels.fetch(channelId)  as TextChannel;

    return channel.threads.create({
      name: threadName,
      reason: 'Thread created via API',
      type: "GUILD_PUBLIC_THREAD",
      archived: false,
      message: {
        content: content,
      }
    } as any);
  }

  async removeThread(channelId: string, threadName: string,){
    const channel = await this.client.channels.fetch(channelId)  as TextChannel;
    
    let thread = channel.threads.cache.find(
      (t) => t.name === threadName
    ) as ThreadChannel;
    if(thread){
      thread.delete();
    }
  }
  
  async sendMessageToDiscord(
    content: string,
    threadName: string,
    channelId: string
  ) {
    try {
      const channel = (await this.client.channels.fetch(
        channelId
      )) as TextChannel;

      if (!channel) {
        throw new Error("Channel not found");
      }

      let thread = channel.threads.cache.find(
        (t) => t.name === threadName
      ) as ThreadChannel;

      if (!thread) {
        thread = await channel.threads.create({
          name: threadName,
          archived: false,
          type: "GUILD_PUBLIC_THREAD",
          message: {
            content: "This thread is created for GitLab events.",
          },
        } as any);
      }

      await thread.send(content + "\n");
    } catch (error) {
      console.error("Error sending message to Discord:", error);
    }
  }
}

export default new DiscordService();
