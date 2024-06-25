import {NextFunction, Request, Response} from "express";
import {SendResponseData} from "@/types/express";

export default function formatterMiddleware(req: Request, res: Response, next: NextFunction) {
  res.sendResponse = (opts: SendResponseData) => {
    console.log('sending response');
    return res.status(opts.status || 200).json({
      data: opts.data,
      message: opts.message || "ok",
      status: opts.status || 200,
    });
  }
  next();
}
