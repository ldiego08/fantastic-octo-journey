import { PrismaClient } from "@prisma/client";
import { ActionResult } from "./types";
import { MAX_BOARD_DEPTH } from "./consts";

export type MoveBoardArgs = {
  id: number;
  parentId: number;
  db: PrismaClient;
};

export type MoveBoardResult = ActionResult<{
  updatedBoard: {
    id: number;
    parentId: number;
  };
}>;

export async function moveBoard({
  id,
  parentId,
  db,
}: MoveBoardArgs): Promise<MoveBoardResult> {
  try {
    const board = await db.board.findUnique({
      where: { id },
    });

    if (!board) {
      return {
        success: false,
        error: `Board ${id} not found`,
        errorCode: "BOARD_NOT_FOUND",
      };
    }

    let newDepth = 0;

    if (parentId) {
      const parent = await db.board.findUnique({
        where: { id: parentId },
        select: { depth: true },
      });

      if (!parent) {
        return {
          success: false,
          error: `New parent board ${parentId} for board ${id} was not found`,
          errorCode: "BOARD_NEW_PARENT_NOT_FOUND",
        };
      }

      newDepth = parent.depth + 1;

      if (newDepth > MAX_BOARD_DEPTH) {
        return {
          success: false,
          error: `Maximum depth of ${MAX_BOARD_DEPTH} exceeded`,
          errorCode: "BOARD_MAX_DEPTH_EXCEEDED",
        };
      }
    }

    const updatedBoard = await db.board.update({
      where: { id },
      data: {
        parentId: parentId || null,
        depth: newDepth,
      },
    });

    return {
      success: true,
      data: {
        updatedBoard: {
          id: updatedBoard.id,
          parentId: parentId,
        },
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
