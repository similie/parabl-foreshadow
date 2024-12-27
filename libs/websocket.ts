import { io, Socket } from "socket.io-client";

class SocketService {
  private static _instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static get instance(): SocketService {
    if (!SocketService._instance) {
      SocketService._instance = new SocketService();
    }
    return SocketService._instance;
  }

  public connect(url: string, token: string): void {
    if (!this.socket) {
      this.socket = io(url, {
        transports: ["websocket", "webtransport", "polling"],
        reconnection: true,
        auth: { token },
      });

      this.socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      this.socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });
    }
  }

  public subscribe(topic: string, callback: (data: any) => void): void {
    if (!this.socket) {
      console.warn("Socket is not connected");
      return;
    }
    this.socket.on(topic, callback);
  }

  public unsubscribe(topic: string): void {
    if (this.socket) {
      this.socket.off(topic);
    }
  }

  public publish(topic: string, data: any): void {
    if (!this.socket) {
      console.warn("Socket is not connected");
      return;
    }
    this.socket.emit(topic, data);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SocketService;
