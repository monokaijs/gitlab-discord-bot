import express from "express";
import {apiRoute} from "@/routes/api.route.ts";
import {webhookRoute} from "@/routes/webhook.route.ts";

export const mainRouter = express.Router();

mainRouter.get('/api', apiRoute);
mainRouter.get('/webhook', webhookRoute);
