import {Gitlab} from "@gitbeaker/core";
import {requesterFn} from "@/utils/gitlabRequestor";
import * as process from "process";

class GitlabService {
  instance = new Gitlab({
    host: 'https://northstudio.dev',
    token: process.env.GITLAB_TOKEN,
    requesterFn
  });

  getProject(projectId: string) {
    return this.instance.Projects.show(projectId);
  }

  async bindProject(projectId: string) {
    const hookUrl = process.env.DEPLOYMENT_URL + '/webhooks/gitlab';
    return this.instance.ProjectHooks.add(projectId, hookUrl, {
      pushEvents: true,
      tagPushEvents: true,
      jobEvents: true,
      confidentialIssuesEvents: true,
      confidentialNoteEvents: true,
      wikiPageEvents: true,
      deploymentEvents: true,
      issuesEvents: true,
      noteEvents: true,
      pipelineEvents: true,
      releasesEvents: true,
      mergeRequestsEvents: true,
      enableSslVerification: false,
    })
  }

  async getLastLogLines(projectId: string, pipelineId: number, limitLines = 5) {
    const jobs = await this.instance.Jobs.all(projectId, {
      pipelineId: pipelineId,
      status: 'running',
    });
    if (jobs) {
      // const ongoingJob = jobs.
      const runningJobs = jobs.filter(job => job.status === 'running').sort((a, b) => b.id - a.id);
      const lastJob = runningJobs.pop();
      const log = await this.instance.Jobs.showLog(projectId, lastJob.id);
      const logLines = log.split('\n');
      const ansiEscapePattern = /\x1B\[[0-9;]*[JKmsu]/g;
      if (logLines.length < 5) {
        return logLines.join('\n').replace(ansiEscapePattern, '');
      } else {
        return logLines.slice(-limitLines).join('\n').replace(ansiEscapePattern, '');
      }
    } else return "";
  }

  async getLastJobLogLines(projectId: string, pipelineId: number, jobId: number, limitLines = 5) {
    const log = await this.instance.Jobs.showLog(projectId, jobId);
    const logLines = log.split('\n');
    const ansiEscapePattern = /\x1B\[[0-9;]*[JKmsu]/g;
    if (logLines.length < 5) {
      return logLines.join('\n').replace(ansiEscapePattern, '');
    } else {
      return logLines.slice(-limitLines).join('\n').replace(ansiEscapePattern, '');
    }
  }
}

export default new GitlabService();
