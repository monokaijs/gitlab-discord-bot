import { TopicBinding } from "@/models/topics-binding.modal";
import { GitLabObjectKind } from "@/types/gitlab";
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

  async createThread(channelId: string, threadName: string, content: string) {
    const channel = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;

    return await channel.threads.create({
      name: threadName,
      reason: "Thread created via API",
      type: 11,
      archived: false,
      message: {
        content: content,
      },
    } as any);
  }

  async removeThread(channelId: string, threadName: string) {
    const channel = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;

    let thread = channel.threads.cache.find(
      (t) => t.name === threadName
    ) as ThreadChannel;
    if (thread) {
      thread.delete();
    }
  }

  async closeThread(channelId: string, threadId: string) {
    const channel = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;

    let thread = channel.threads.cache.find(
      (t) => t.id === threadId
    ) as ThreadChannel;
    if (thread) {
      await thread.setArchived(true);
    }
  }

  async reOpenThread(channelId: string, threadId: string) {
    const channel = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;

    let thread = channel.threads.cache.find(
      (t) => t.id === threadId
    ) as ThreadChannel;
    if (thread) {
      await thread.setArchived(false);
    }
  }

  async sendMessageToThread(
    content: string,
    threadId: string,
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
        (t) => t.id === threadId
      ) as ThreadChannel;
      if (!thread) {
        thread = await channel.threads.create({
          name: threadId,
          archived: false,
          type: "GUILD_PUBLIC_THREAD",
          message: {
            content: "This thread is created for GitLab events.",
          },
        } as any);
      }

      const send = await thread.send(content + "\n");
      return send;
    } catch (error) {
      console.error("Error sending message to Discord:", error);
    }
  }

  async bindTopics(
    projectId: string,
    channelId: string,
    topics: GitLabObjectKind[]
  ) {
    const threadTitles = {
      [GitLabObjectKind.Push]: "Activities",
      [GitLabObjectKind.MergeRequest]: "Merge request",
    };

    const channel = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;
    if (!channel) {
      console.error("Channel not found");
      return;
    }

    topics.forEach(async (topic) => {
      const threadName = threadTitles[topic];
      const thread = channel.threads.cache.find((t) => t.name === threadName);
      if (!thread) {
        const createThread = await this.createThread(
          channelId,
          threadName,
          threadName
        );
        await TopicBinding.create({
          gitlabId: projectId,
          topicId: topic,
          channelId: channelId,
          threadId: createThread.id,
          thread: createThread,
        });
        // createThread.pin();
      } else {
        await TopicBinding.create({
          gitlabId: projectId,
          topicId: topic,
          channelId: channelId,
          threadId: thread.id,
          thread: thread,
        });
      }
    });
  }

  async editMessageToDiscord(
    content: string,
    threadId: string,
    channelId: string,
    chatId: string,
    newTitle?: string
  ) {
    const channel = (await this.client.channels.fetch(
      channelId
    )) as TextChannel;
    if (!channel) {
      console.error("Channel not found");
      return;
    }

    const thread = channel.threads.cache.find((t) => t.id === threadId);
    if (!thread) {
      console.error("Thread not found");
      return;
    }

    if (newTitle) {
      await thread.edit({ name: newTitle });
    }

    const message = await thread.messages.fetch(chatId);
    if (!message) {
      console.error("Message not found");
      return;
    }

    await message.edit(content);
  }
  catch(error) {
    console.error("Error sending message to Discord:", error);
  }
}

export default new DiscordService();
