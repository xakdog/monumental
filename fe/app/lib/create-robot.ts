import WebSocket from "ws";

interface RobotCreationResponse {
  type: string;
  id?: string;
  error?: string;
}

export function createRobot(jointNames: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(process.env.WS_URL as string);

    ws.on("open", () => {
      ws.send(JSON.stringify({ type: "createRobot", jointNames }));
    });

    ws.on("message", (data: WebSocket.Data) => {
      try {
        const response: RobotCreationResponse = JSON.parse(data.toString());
        if (response.type === "robotCreated" && response.id) {
          resolve(response.id);
        } else if (response.error) {
          reject(new Error(response.error));
        }
      } catch (error) {
        reject(new Error("Failed to parse the server response."));
      } finally {
        ws.close();
      }
    });

    ws.on("error", (error) => {
      reject(new Error(`WebSocket error: ${error.message}`));
    });
  });
}
