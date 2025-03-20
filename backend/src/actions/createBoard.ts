import { Board, PrismaClient } from "@prisma/client";

import {
  BoardMaxDepthExceededError,
  BoardParentNotFoundError,
  UnknownError,
} from "./errors";

export type CreateBoardArgs = {
  name: string;
  parentId?: number;
  db: PrismaClient;
};

export type CreateBoardResult = {
  createdBoard: Board;
};

export async function createBoard({
  name,
  parentId,
  db,
}: CreateBoardArgs): Promise<CreateBoardResult> {
  let depth = 0;

  if (parentId) {
    const parent = await db.board.findUnique({
      where: { id: parentId },
      select: { depth: true },
    });

    if (!parent) {
      throw new BoardParentNotFoundError(parentId);
    }

    depth = parent.depth + 1;

    if (depth > 10) {
      throw new BoardMaxDepthExceededError();
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
    createdBoard: board,
  };
}
