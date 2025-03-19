import { Board, PrismaClient } from "@prisma/client";
import { MAX_BOARD_DEPTH } from "./consts";
import { ActionResult } from "./types";

export type CreateBoardArgs = {
  name: string;
  parentId?: number;
  db: PrismaClient;
};

export type CreateBoardData = {
  createdBoard: Board;
};

export async function createBoard({
  name,
  parentId,
  db,
}: CreateBoardArgs): Promise<ActionResult<CreateBoardData>> {
  try {
    let depth = 0;

    if (parentId) {
      const parent = await db.board.findUnique({
        where: { id: parentId },
        select: { depth: true },
      });

      if (!parent) {
        return {
          success: false,
          error: "Parent not found",
          errorCode: "BOARD_PARENT_NOT_FOUND",
        };
      }

      depth = parent.depth + 1;

      if (depth > 10) {
        return {
          success: false,
          error: `Maximum depth of ${MAX_BOARD_DEPTH} exceeded`,
          errorCode: "BOARD_MAX_DEPTH_EXCEEDED",
        };
      }
    }

    const board = await db.board.create({
      data: {
        name,
        parentId: parentId || null,
        depth,
      },
    });

    return {
      success: true,
      data: {
        createdBoard: board,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: (<Error>error).message,
      errorCode: "UNKNOWN",
    };
  }
}
