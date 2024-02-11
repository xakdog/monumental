import { RobotServer } from "./state";
import { WebSocketServer } from "ws";

const host = "0.0.0.0" || process.env.HOST;
const portNumber = parseInt(process.env.PORT || "");
const port = isNaN(portNumber) ? 8080 : portNumber;

const wss = new WebSocketServer({ host, port });
const _robot = new RobotServer(wss);

wss.on("listening", () =>
  console.log(`Server started on ws://${host}:${port}`),
);
