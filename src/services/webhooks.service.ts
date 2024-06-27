import { ProjectBinding } from "@/models/project-binding.model";
import discordService from "./discord.service";
import {
  GitLabEvent,
  GitLabIssueEvent,
  GitLabMergeRequestEvent,
  GitLabNoteEvent,
  GitLabObjectKind,
  GitLabPipelineEvent,
  GitLabPushEvent,
  GitLabTagPushEvent,
} from "@/types/gitlab";
import moment from "moment";
import gitlabService from "./gitlab.service";
import ciService from "./ci.service";
import { IssueBinding } from "@/models/issue-binding.model";
import { TopicBinding } from "@/models/topics-binding.modal";

class WebhookService {
  async gitlabAction(event: GitLabEvent) {
    const projectId = event.project.id;
    const channel = await ProjectBinding.findOne({
      gitlabId: projectId,
    });
    const channelId = channel.channel.id;

    switch (event.object_kind) {
      case GitLabObjectKind.Push:
        await this.handlePushEvent(event as GitLabPushEvent, channelId);
        break;
      case GitLabObjectKind.MergeRequest:
        await this.handleMergeRequestEvent(
          event as GitLabMergeRequestEvent,
          channelId
        );
        break;
      case GitLabObjectKind.Issue:
        await this.handleIssueEvent(event as GitLabIssueEvent, channelId);
        break;
      case GitLabObjectKind.Pipeline:
        await this.handlePipelineEvent(event as GitLabPipelineEvent, channelId);
        break;
      case GitLabObjectKind.Build:
        await this.handleBuildEvent(event as any, channelId);
        break;
      // case GitLabObjectKind.Note:
      //   await this.handleNoteEvent(event as GitLabNoteEvent, channelId);
      //   break;
      // case GitLabObjectKind.TagPush:
      //   await this.handleTagPushEvent(event as GitLabTagPushEvent, channelId);
      //   break;
      default:
        console.warn(`Unhandled event: ${event.object_kind}`);
    }
  }

  private async handlePushEvent(event: GitLabPushEvent, channelId: string) {
    const title = `${event.user_name} pushed ${
      event.commits.length
    } commits onto [${event.repository.name}](<${
      event.repository.homepage
    }>) (${event.ref.split("/").slice(-1)[0]}).`;
    const changes = event.commits.map((commit) => {
      const time = moment(commit.timestamp).format("hh:mm MM/DD/YYYY");
      const author = commit.author.name;
      const totalChanges =
        commit.added.length + commit.removed.length + commit.modified.length;

      return `➡️ [${time}] [${author}] [${totalChanges} changes] \n    ${commit.message}`;
    });

    const lastCommitUrl = `${event.commits.slice(-1)[0].url}`;
    const content =
      title +
      "```" +
      changes.join("\n") +
      "```" +
      `[View last commit](<${lastCommitUrl}>)`;

    const topicBinding = await TopicBinding.findOne({
      gitlabId: event.project.id,
      channelId: channelId,
      topicId: GitLabObjectKind.Push,
    });

    await discordService.sendMessageToThread(
      content,
      topicBinding.threadId ?? "Activities",
      channelId
    );
  }

  private async handleMergeRequestEvent(
    event: GitLabMergeRequestEvent,
    channelId: string
  ) {
    const content = `[Merge request](<${event.object_attributes.url}>) ${event.object_attributes.source_branch} to ${event.object_attributes.target_branch} by ${event.user.name}: ${event.object_attributes.title}`;

    const topicBinding = await TopicBinding.findOne({
      gitlabId: event.project.id,
      channelId: channelId,
      topicId: GitLabObjectKind.MergeRequest,
    });

    await discordService.sendMessageToThread(
      content,
      topicBinding.threadId ?? "Merge request",
      channelId
    );
  }

  private async handleIssueEvent(event: GitLabIssueEvent, channelId: string) {
    const isReOpen =
      event?.changes?.closed_at?.previous &&
      !event?.changes?.closed_at?.current;
    const isClosed = !!event?.changes?.closed_at?.current;
    const issueId = event.object_attributes.id;
    const issueBinding = await IssueBinding.findOne({
      issueId: issueId,
    });

    const content = `Issue [#${issueId}](<${event.object_attributes.url}>) - ${event.object_attributes.title}\nIssue event by ${event.user.username}: ${event.object_attributes.description}`;
    if (isClosed) {
      await discordService.closeThread(channelId, issueBinding.threadId);
      issueBinding.isClosed = true;
      await issueBinding.save();
    } else {
      if (isReOpen) {
        await discordService.reOpenThread(channelId, issueBinding.threadId);
        issueBinding.isClosed = false;
        await issueBinding.save();
      } else {
        const threadTitle = `Issue #${issueId} - ${event.object_attributes.title}`;
        const thread = await discordService.createThread(
          channelId,
          threadTitle,
          content
        );

        await IssueBinding.create({
          issueId: issueId,
          threadId: thread.id,
        });
      }
    }
  }

  private async handlePipelineEvent(
    event: GitLabPipelineEvent,
    channelId: string
  ) {
    await ciService.pipelineEvent(event);
  }

  private async handleBuildEvent(
    event: GitLabPipelineEvent,
    channelId: string
  ) {
    await ciService.jobEvent(event);
  }

  // private async handleNoteEvent(event: GitLabNoteEvent, channelId: string) {
  //   const content = `Note event by ${event.user.username}: ${event.object_attributes.note}`;
  //   await discordService.sendMessageToThread(content, "notes", channelId);
  // }

  // private async handleTagPushEvent(
  //   event: GitLabTagPushEvent,
  //   channelId: string
  // ) {
  //   const content = `Tag Push event by ${event.user_name}: ${event.ref}`;
  //   await discordService.sendMessageToThread(content, "tag-pushes", channelId);
  // }
}

export default new WebhookService();
