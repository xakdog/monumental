import { WebSocketServer, WebSocket } from "ws";

interface Robot {
  id: string;
  joints: Map<string, number>;
  subscribers: Set<WebSocket>;
}

export class RobotServer {
  private robots: Map<string, Robot> = new Map();
  private wss: WebSocketServer;

  constructor(server: WebSocketServer) {
    this.wss = server;
    this.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (message: string) => this.handleMessage(ws, message));
    });
  }

  private handleMessage(ws: WebSocket, message: string): void {
    let msg: any;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      ws.send(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    switch (msg.type) {
      case "createRobot":
        this.createRobot(ws, msg.jointNames);
        break;
      case "subscribeToRobot":
        this.subscribeToRobot(ws, msg.robotId);
        break;
      case "controlJoint":
        this.controlJoint(ws, msg.robotId, msg.jointName, msg.value);
        break;
      default:
        ws.send(JSON.stringify({ error: "Unknown command" }));
    }
  }

  private createRobot(ws: WebSocket, jointNames: string[]): void {
    const id = getUniqueRobotId();
    const joints = new Map<string, number>();
    jointNames.forEach((jointName) => joints.set(jointName, 0));
    const robot: Robot = { id, joints, subscribers: new Set() };
    this.robots.set(id, robot);
    ws.send(JSON.stringify({ type: "robotCreated", id }));
  }

  private subscribeToRobot(ws: WebSocket, robotId: string): void {
    const robot = this.robots.get(robotId);
    if (!robot) {
      ws.send(JSON.stringify({ error: "Robot not found", robotId }));
      return;
    }
    robot.subscribers.add(ws);
    ws.send(JSON.stringify({ type: "subscribed", robotId }));
    robot.joints.forEach((value, jointName) => {
      ws.send(
        JSON.stringify({ type: "jointUpdated", robotId, jointName, value }),
      );
    });
  }

  private controlJoint(
    ws: WebSocket,
    robotId: string,
    jointName: string,
    value: number,
  ): void {
    const robot = this.robots.get(robotId);

    if (!robot) {
      ws.send(JSON.stringify({ error: "Robot not found", robotId }));
      return;
    }

    if (!robot.joints.has(jointName)) {
      ws.send(JSON.stringify({ error: "Joint not found", jointName }));
      return;
    }

    robot.joints.set(jointName, value);
    robot.subscribers.forEach((subscriber) => {
      subscriber.send(
        JSON.stringify({ type: "jointUpdated", robotId, jointName, value }),
      );
    });
  }
}

const getUniqueRobotId = () => {
  return Math.random().toString(36).substring(2);
};
