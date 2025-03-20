import { PrismaClient } from "@prisma/client";

import { MAX_BOARD_DEPTH } from "./consts";

import {
  BoardMaxDepthExceededError,
  BoardNotFoundError,
  BoardParentNotFoundError,
  UnknownError,
} from "./errors";

export type MoveBoardArgs = {
  id: number;
  parentId: number;
  db: PrismaClient;
};

export type MoveBoardResult = {
  updatedBoard: {
    id: number;
    parentId: number;
  };
};

export async function moveBoard({
  id,
  parentId,
  db,
}: MoveBoardArgs): Promise<MoveBoardResult> {
  const board = await db.board.findUnique({
    where: { id },
  });

  if (!board) {
    throw new BoardNotFoundError(id);
  }

  let newDepth = 0;

  if (parentId) {
    const parent = await db.board.findUnique({
      where: { id: parentId },
      select: { depth: true },
    });

    if (!parent) {
      throw new BoardParentNotFoundError(parentId);
    }

    newDepth = parent.depth + 1;

    if (newDepth > MAX_BOARD_DEPTH) {
      throw new BoardMaxDepthExceededError();
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
    updatedBoard: {
      id: updatedBoard.id,
      parentId: parentId,
    },
  };
}
