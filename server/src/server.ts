import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { Common } from "./rooms/common";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server: server,
  express: app,
});
gameServer.define("public", Common);
gameServer.define("private", Common).filterBy(["password"]);
gameServer.listen(port);

// console.log(`Listening on ws://localhost:${port}`);
