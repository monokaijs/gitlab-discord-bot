import express from "express";

export const webhookRoute = express.Router();

webhookRoute.get("/", (req, res) => {
  res.json({
    message: 'WEBHOOK_ROUTE'
  })
})
