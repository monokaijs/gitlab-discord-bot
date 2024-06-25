import express from "express";
import discordService from "@/services/discord.service.ts";

export const apiRoute = express.Router();
apiRoute.get('/', (req, res) => {
  res.json({
    message: 'API_ROUTE'
  })
});

apiRoute.get('/channels', async (req, res) => {
  const guilds = await discordService.client.guilds.fetch({
    limit: 100,
  });
  const guild = await guilds.at(0).fetch();
  const channels = await guild.channels.fetch();
  res.sendResponse({
    data: channels,
  })
})
