import { Response } from "express";

declare module "express-serve-static-core" {
  interface Response {
    sendResponse: (opts: SendResponseData) => this;
  }
}

interface SendResponseData {
  data?: any;
  message?: string;
  status?: number;
}
