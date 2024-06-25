import express from "express";
// import mainRouter from "@src/routes";
import bodyParser from "body-parser";
import {createServer as createViteServer} from "vite";

class WebService {
  async register() {
    const app = express();
    const viteServer = await createViteServer({
      server: { middlewareMode: true },
    })
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(viteServer.middlewares);
    // app.use(mainRouter);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log('Web service is listening on port', port);
    });
  }
}

export default new WebService();
