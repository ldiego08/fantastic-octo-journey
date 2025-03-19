import http from "http";
import cors from "cors";

import express, { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { deleteBoard, getBoards, moveBoard, createBoard } from "./actions";

export const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://frontend:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const db = new PrismaClient();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://frontend:3000"],
    credentials: true,
  })
);

interface HelloResponse {
  message: string;
}

app.get("/api/hello", (_req: Request, res: Response<HelloResponse>) => {
  res.json({ message: "Hello from Express Backend!" });
});

const CreateBoardBodySchema = z.object({
  name: z.string(),
  parentId: z.number().optional(),
});

app.post("/api/boards", async (req, res) => {
  const { name, parentId } = CreateBoardBodySchema.parse(req.body);
  const result = await createBoard({ name, parentId, db });

  if (!result.success) {
    console.error(result.error);

    return res.status(500).json({
      errorCode: result.errorCode,
    });
  }

  io.emit("board-created", result.data);

  return res.json(result.data);
});

app.get("/api/boards", async (req, res) => {
  const result = await getBoards({ db });

  if (!result.success) {
    console.error(result.error);

    return res.status(500).json({
      errorCode: result.errorCode,
    });
  }

  return res.json(result.data);
});

const DeleteBoardParamsSchema = z.object({
  id: z.coerce.number(),
});

app.delete("/api/boards/:id", async (req: Request, res: Response) => {
  const { id } = DeleteBoardParamsSchema.parse(req.params);
  const result = await deleteBoard({ id, db });

  if (!result.success) {
    console.error(result.error);

    return res.status(500).json({
      errorCode: result.errorCode,
    });
  }

  io.emit("board-deleted", result.data);

  return res.json(result.data);
});

const MoveBoardParamsSchema = z.object({
  id: z.coerce.number(),
});

const MoveBoardBodySchema = z.object({
  parentId: z.coerce.number(),
});

app.put("/api/boards/:id/move", async (req, res) => {
  const { id } = MoveBoardParamsSchema.parse(req.params.id);
  const { parentId } = MoveBoardBodySchema.parse(req.body);

  const result = await moveBoard({ id, parentId, db });

  if (!result.success) {
    console.error(result.error);

    return res.status(500).json({
      errorCode: result.errorCode,
    });
  }

  io.emit("board-moved", result.data);

  return res.json(result.data);
});

// interface NotificationMessage {
//   message: string;
// }

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// // Broadcast notification every second
// setInterval(() => {
//   const notification: NotificationMessage = {
//     message: "Server notification: " + new Date().toLocaleString(),
//   };
//   io.emit("notification", notification);
// }, 1000);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
