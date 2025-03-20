import http from "http";
import cors from "cors";

import express, { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { deleteBoard, getBoards, moveBoard, createBoard } from "./actions";
import { withErrorHandle } from "./http";

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

const CreateBoardBodySchema = z.object({
  name: z.string(),
  parentId: z.number().optional(),
});

app.post(
  "/api/boards",
  withErrorHandle(async (req, res) => {
    const { name, parentId } = CreateBoardBodySchema.parse(req.body);
    const result = await createBoard({ name, parentId, db });

    io.emit("board-created", result);

    return res.json(result);
  })
);

app.get(
  "/api/boards",
  withErrorHandle(async (req, res) => {
    const result = await getBoards({ db });
    return res.json(result);
  })
);

const DeleteBoardParamsSchema = z.object({
  id: z.coerce.number(),
});

app.delete(
  "/api/boards/:id",
  withErrorHandle(async (req: Request, res: Response) => {
    const { id } = DeleteBoardParamsSchema.parse(req.params);
    const result = await deleteBoard({ id, db });

    io.emit("board-deleted", result);

    return res.json(result);
  })
);

const MoveBoardParamsSchema = z.object({
  id: z.coerce.number(),
});

const MoveBoardBodySchema = z.object({
  parentId: z.coerce.number(),
});

app.put(
  "/api/boards/:id/move",
  withErrorHandle(async (req, res) => {
    const { id } = MoveBoardParamsSchema.parse(req.params.id);
    const { parentId } = MoveBoardBodySchema.parse(req.body);

    const result = await moveBoard({ id, parentId, db });

    io.emit("board-moved", result);

    return res.json(result);
  })
);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
