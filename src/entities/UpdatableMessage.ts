import discordService from "@/services/discord.service";
import { SendMessageOptions } from "node-telegram-bot-api";

export class UpdatableMessage {
  text = "";
  threadId: string = "";
  options?: SendMessageOptions = {};
  messageId: string;
  channelId: string;

  constructor(
    channelId: string,
    threadId: string,
    text: string,
    options?: SendMessageOptions
  ) {
    this.channelId = channelId;
    this.threadId = threadId;
    this.text = text;
    this.options = options;
  }

  async send() {
    const response: any = await discordService.sendMessageToThread(
      this.text,
      this.threadId,
      this.channelId
    );
    this.messageId = response.id;
    return response;
  }

  async editText(newText: string, newTitle?: string) {
    if (this.text === newText) return;
    this.text = newText;
    if (!this.messageId) return;
    return await discordService.editMessageToDiscord(
      newText,
      this.threadId,
      this.channelId,
      this.messageId,
      newTitle
    );
  }

  async close() {
    console.log(`Close thread: ${this.threadId}, channel: ${this.channelId}`);
    return await discordService.closeThread(this.channelId, this.threadId);
  }
}
