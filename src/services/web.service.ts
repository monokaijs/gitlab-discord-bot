import express from "express";
// import mainRouter from "@src/routes";
import bodyParser from "body-parser";

class WebService {
  async register() {
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // app.use(mainRouter);

    app.listen(port, () => {
      console.log('Web service is listening on port', port);
    });
  }
}

export default new WebService();
