import webhooksService from "@/services/webhooks.service";
import express from "express";

export const webhookRoute = express.Router();

webhookRoute.get("/", (req, res) => {
  res.json({
    message: 'WEBHOOK_ROUTE'
  })
})

webhookRoute.post("/gitlab", (req, res) => {
  webhooksService.gitlabAction(req.body);

  res.json({
    message: 'WEBHOOK_ROUTE'
  })
})
