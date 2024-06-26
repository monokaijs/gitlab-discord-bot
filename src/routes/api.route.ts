import express from "express";
import discordService from "@/services/discord.service.ts";
import gitlabService from "@/services/gitlab.service";
import { ProjectBinding } from "@/models/project-binding.model";

export const apiRoute = express.Router();
apiRoute.get("/", (req, res) => {
  res.json({
    message: "API_ROUTE",
  });
});

apiRoute.get("/gitlab-projects", async (req, res) => {
  const name = req.query.name as string;
  const projects = await gitlabService.getProjects(name, {});
  const projectsBinding = await Promise.all(
    projects.map(async (project) => {
      const projectBinding = await ProjectBinding.findOne({
        gitlabId: project.id,
      });
      if (projectBinding) {
        project.binding = projectBinding;
      }

      return project;
    })
  );
  res.sendResponse({
    data: projectsBinding,
  });
});

apiRoute.get("/channels", async (req, res) => {
  const guilds = await discordService.client.guilds.fetch({
    limit: 100,
  });
  const guild = await guilds.at(0).fetch();
  const channels = await guild.channels.fetch();

  let channelsBinding = JSON.parse(JSON.stringify(channels));

  channelsBinding = await Promise.all(
    channelsBinding.map(async (channel) => {
      const bindingData = await ProjectBinding.findOne({
        "channel.id": channel.id,
      });
      if (bindingData) {
        channel.binding = bindingData;
      }
      return channel;
    })
  );

  res.sendResponse({
    data: channelsBinding,
  });
});

apiRoute.post("/bind-project", async (req, res) => {
  const body = req.body;
  const bindProject = await gitlabService.bindProject(
    body.projectId,
    body.channel
  );
  res.sendResponse(bindProject);
});

apiRoute.post("/unbind-project", async (req, res) => {
  const body = req.body;
  const unbindProject = await gitlabService.unbindProject(
    body.projectId
  );
  res.sendResponse(unbindProject);
});
