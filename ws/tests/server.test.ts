import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { WebSocketServer } from "ws";

import { RobotServer } from "../src/state";
import { WebSocketTestClient } from "./test-client";

const WS_TEST_PORT = 8081;
const WS_TEST_URL = `ws://localhost:${WS_TEST_PORT}`;

let wss: WebSocketServer;
let server: RobotServer;

describe("Robot WebSocket Server", () => {
  beforeAll(async () => {
    wss = new WebSocketServer({ port: WS_TEST_PORT });
    server = new RobotServer(wss);

    return new Promise((resolve) => {
      wss.on("listening", () => resolve());
    });
  });

  afterAll(() => wss.close());

  it("should allow creating a robot and return a robot ID", async () => {
    expect.assertions(2);

    const ws = new WebSocketTestClient(WS_TEST_URL);

    await ws.connect();
    await ws.sendMessage({
      type: "createRobot",
      jointNames: ["arm", "leg"],
    });

    const messages = await ws.expectMessages(1); // Expect 1 message within the default timeout
    const response = messages[0];

    expect(response).toHaveProperty("type", "robotCreated");
    expect(response).toHaveProperty("id");
  });

  it("should allow creating a robot and changing one of its joints", async () => {
    expect.assertions(5);

    const ws = new WebSocketTestClient(WS_TEST_URL);

    await ws.connect();
    await ws.sendMessage({ type: "createRobot", jointNames: ["arm", "leg"] });

    const response = await ws.expectMessages(1);

    expect(response[0]).toHaveProperty("type", "robotCreated");
    expect(response[0]).toHaveProperty("id");

    const robotId = response[0].id;

    await ws.sendMessage({
      type: "subscribeToRobot",
      robotId,
    });

    await ws.expectMessages(3); // subscribed, arm, leg
    await ws.sendMessage({
      type: "controlJoint",
      robotId,
      jointName: "arm",
      value: 45,
    });

    const jointUpdate = await ws.expectMessages(1);

    expect(jointUpdate[0]).toHaveProperty("type", "jointUpdated");
    expect(jointUpdate[0]).toHaveProperty("jointName", "arm");
    expect(jointUpdate[0]).toHaveProperty("value", 45);

    ws.close();
  });

  it("should send the last state upon reconnection", async () => {
    expect.assertions(3);

    const clientInitial = new WebSocketTestClient(WS_TEST_URL);
    await clientInitial.connect();

    await clientInitial.sendMessage({
      type: "createRobot",
      jointNames: ["arm", "leg"],
    });
    const messagesInitial = await clientInitial.expectMessages(1);
    const robotId = messagesInitial[0].id;

    await clientInitial.sendMessage({
      type: "controlJoint",
      robotId: robotId,
      jointName: "arm",
      value: 45,
    });

    // No need to explicitly wait for a response here, assuming the server processes commands sequentially
    clientInitial.close();

    const clientReconnect = new WebSocketTestClient(WS_TEST_URL);
    await clientReconnect.connect();

    await clientReconnect.sendMessage({
      type: "subscribeToRobot",
      robotId: robotId,
    });
    const messagesReconnect = await clientReconnect.expectMessages(3); // subscribed, arm, leg

    const lastState = messagesReconnect.find(
      (msg) => msg.type === "jointUpdated" && msg.jointName === "arm",
    );
    expect(lastState).toBeTruthy();
    expect(lastState).toHaveProperty("robotId", robotId);
    expect(lastState).toHaveProperty("value", 45);

    clientReconnect.close();
  });
});
