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

    await discordService.sendMessageToDiscord(content, "Activities", channelId);
  }

  private async handleMergeRequestEvent(
    event: GitLabMergeRequestEvent,
    channelId: string
  ) {
    const content = `[Merge request](<${event.object_attributes.url}>) ${event.object_attributes.source_branch} to ${event.object_attributes.target_branch} by ${event.user.name}: ${event.object_attributes.title}`;
    await discordService.sendMessageToDiscord(
      content,
      "Merge requests",
      channelId
    );
  }

  private async handleIssueEvent(event: GitLabIssueEvent, channelId: string) {
    const isClosed = !!event.changes?.closed_at;
    const content = `Issue event by ${event.user.username}: ${event.object_attributes.description}`;
    if (isClosed) {
      await discordService.removeThread(
        channelId,
        event.object_attributes.title
      );
    } else {
      await discordService.createThread(
        channelId,
        event.object_attributes.title,
        content
      );
    }
  }

  private async handlePipelineEvent(
    event: GitLabPipelineEvent,
    channelId: string
  ) {
    const title = `${event.user.name} triggered deployment in [${event.project.name}](<${event.project.web_url}>)`;
    const builds = event.builds.map((build) => {
      return `\n ${build.status === "success" ? "🟢" : "🔴"} ${build.stage}: ${
        build.name
      }`;
    });
    const content = title + "```" + builds.join("\n") + "```";
    await discordService.sendMessageToDiscord(content, "Deployment", channelId);
  }

  // private async handleNoteEvent(event: GitLabNoteEvent, channelId: string) {
  //   const content = `Note event by ${event.user.username}: ${event.object_attributes.note}`;
  //   await discordService.sendMessageToDiscord(content, "notes", channelId);
  // }

  // private async handleTagPushEvent(
  //   event: GitLabTagPushEvent,
  //   channelId: string
  // ) {
  //   const content = `Tag Push event by ${event.user_name}: ${event.ref}`;
  //   await discordService.sendMessageToDiscord(content, "tag-pushes", channelId);
  // }
}

export default new WebhookService();
