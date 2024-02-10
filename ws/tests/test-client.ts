import { WebSocket } from "ws";

export class WebSocketTestClient {
  private ws: WebSocket;
  private messageQueue: string[] = [];

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.on("message", (data) => {
      this.messageQueue.push(data.toString());
    });
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws.on("open", resolve);
      this.ws.on("error", reject);
    });
  }

  async sendMessage(message: object): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws.send(JSON.stringify(message), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async expectMessages(count: number, timeout: number = 500): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const checkMessages = () => {
        if (this.messageQueue.length >= count) {
          const messages = this.messageQueue
            .splice(0, count)
            .map((msg) => JSON.parse(msg));
          resolve(messages);
          clearInterval(interval);
        }
      };

      const interval = setInterval(checkMessages, 100);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error("Timeout waiting for messages"));
      }, timeout);

      checkMessages(); // Check immediately if messages are already there
    });
  }

  close(): void {
    this.ws.close();
  }
}
