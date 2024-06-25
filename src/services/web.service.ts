import express from "express";
// import mainRouter from "@src/routes";
import bodyParser from "body-parser";
import {createServer as createViteServer} from "vite";
import {mainRouter} from "@/routes";
import formatterMiddleware from "@/middlewares/formatter.middleware.ts";

class WebService {
  async register() {
    const app = express();
    const viteServer = await createViteServer({
      server: { middlewareMode: true },
    })
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(formatterMiddleware);
    app.use(mainRouter);
    app.use(viteServer.middlewares);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log('Web service is listening on port', port);
    });
  }
}

export default new WebService();
