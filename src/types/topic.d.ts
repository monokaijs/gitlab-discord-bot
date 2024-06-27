interface TopicBindingDto {
    gitlabId: string;
    topicId: string;
    channelId: string;
    threadId: string;
    topic?: object;
    thread?: object;
    isClosed: boolean;
  }
  