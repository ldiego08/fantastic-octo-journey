import request from "supertest";

import { app } from "../src/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

describe("POST /api/boards", () => {
  beforeEach(async () => {
    await db.board.deleteMany();
    await db.$executeRawUnsafe(
      `TRUNCATE TABLE "Board" RESTART IDENTITY CASCADE;`
    );
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should create a board without a parent", async () => {
    const response = await request(app)
      .post("/api/boards")
      .send({ name: "Test Board" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      createdBoard: {
        id: 1,
        depth: 0,
        parentId: null,
        name: "Test Board",
      },
    });
  });

  it("should create a board with a valid parent and set the correct depth", async () => {
    const parentBoard = await db.board.create({
      data: { name: "Parent Board", depth: 0 },
    });

    const response = await request(app)
      .post("/api/boards")
      .send({ name: "Child Board", parentId: parentBoard.id });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      createdBoard: {
        id: 2,
        depth: 1,
        parentId: 1,
        name: "Child Board",
      },
    });
  });

  it("should return an error when the parent board is not found", async () => {
    const response = await request(app)
      .post("/api/boards")
      .send({ name: "Invalid Board", parentId: 9999 });

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      errorCode: "BOARD_PARENT_NOT_FOUND",
    });
  });

  it("should return an error when creating a board would exceed maximum depth", async () => {
    let currentBoard = await db.board.create({
      data: { name: "Root Board", depth: 0 },
    });

    for (let i = 1; i <= 10; i++) {
      currentBoard = await db.board.create({
        data: {
          name: `Board Level ${i}`,
          parentId: currentBoard.id,
          depth: i,
        },
      });
    }

    const response = await request(app)
      .post("/api/boards")
      .send({ name: "Too Deep Board", parentId: currentBoard.id });

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      errorCode: "BOARD_MAX_DEPTH_EXCEEDED",
    });
  });
});
