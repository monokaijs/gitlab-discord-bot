import {Gitlab} from "@gitbeaker/core";
import {requesterFn} from "@/utils/gitlabRequestor";
import * as process from "process";
import { ProjectBinding } from "@/models/project-binding.model";

class GitlabService {
  instance = new Gitlab({
    host: 'https://northstudio.dev',
    token: process.env.GITLAB_TOKEN,
    requesterFn
  });

  async getProjects(projectName: string = "", options?: any){
    return this.instance.Projects.search(projectName, options)
  }

  getProject(projectId: string) {
    return this.instance.Projects.show(projectId);
  }

  async bindProject(projectId: string, channel: any) {
    const hookUrl = process.env.DEPLOYMENT_URL + '/webhooks/gitlab';
    try {
      await this.instance.ProjectHooks.add(projectId, hookUrl, {
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

      const gitlabProject = await this.instance.Projects.show(projectId);
  
      await ProjectBinding.create({
        channel: channel,
        gitlabId: projectId,
        gitlab: gitlabProject
      });

      return {
        data: {
          success: true,
        },
        message: "Success"
      }
    } catch (error) {
      return {
        data: {
          success: false,
        },
        status: 400,
        message: error.message
      }
    }
  }

  async unbindProject(projectId: string){
    try {
      const hooks = await this.instance.ProjectHooks.all(projectId);
      for (const hook of hooks) {
        const hookId = hook.id;
        await this.instance.ProjectHooks.remove(projectId, hookId);
      }

      await ProjectBinding.deleteMany({gitlabId: projectId})

      return {
        data: {
          success: true,
        },
        message: "Success"
      }
    } catch (error) {
      return {
        data: {
          success: false,
        },
        status: 400,
        message: error.message
      }
    }
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
