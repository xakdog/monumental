import { RobotServer } from "./state";
import { WebSocketServer } from "ws";

const port = 8080 || process.env.PORT;

const wss = new WebSocketServer({ port });
const _robot = new RobotServer(wss);

wss.on("listening", () =>
  console.log(`Server started on ws://localhost:${port}`),
);
