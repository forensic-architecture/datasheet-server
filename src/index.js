import http from "http";
import express from "express";
import initialize from "./initialize";
import middleware from "./middleware";
import api from "./api";
import config from "./config";

let app = express();
app.server = http.createServer(app);

initialize(controller => {
  app.use(
    middleware({
      config,
      controller
    })
  );
  app.use(
    "/api",
    api({
      config,
      controller
    })
  );

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
