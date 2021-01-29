import http from "http";
import express from "express";
import cors, { CorsOptions } from "cors";
import { Server } from "colyseus";
import { Common } from "./rooms/common";

const app = express();
const port = Number(process.env.PORT || 3000);
const corsOptions: CorsOptions = {
  origin: process.env.ORIGIN_URL || "http://localhost:8080",
};

app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server: server,
  express: app,
});
gameServer.define("public", Common);
gameServer.define("private", Common).filterBy(["password"]);
gameServer.listen(port);

app.get("/is-online", (req, res) => {
  res.send({ success: true });
});

console.log(`Listening on port ${port}  👁  ...️`);
