import { Server } from "socket.io";
import { subscribeToRoomEvents } from "./room-events";

let io: Server | null = null;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`WebSocket connected: ${socket.id}`);

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  subscribeToRoomEvents();
  
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized. Call initSocket(server) first.",
    );
  }
  return io;
};

