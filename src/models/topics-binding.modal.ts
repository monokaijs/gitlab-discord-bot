import * as mongoose from "mongoose";
import {Document, model, Model} from "mongoose";

interface TopicBindingMethods {
}
export interface TopicBindingDocument extends TopicBindingDto, Document, TopicBindingMethods {
}

export type TopicBindingModel = Model<TopicBindingDto, TopicBindingDocument, TopicBindingMethods>;

const schema = new mongoose.Schema<TopicBindingDto>({
  gitlabId: String,
  topicId: String,
  channelId: String,
  threadId: String,
  topic: Object,
  thread: Object,
  isClosed: {
    type: Boolean,
    default: false
  }
});

export const TopicBinding = model<TopicBindingDto, TopicBindingModel>('TopicBinding', schema);
