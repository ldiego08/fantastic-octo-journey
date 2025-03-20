import { PrismaClient } from "@prisma/client";
import { ActionResult } from "./types";
import { UnknownError } from "./errors";

export type DeleteBoardArgs = {
  id: number;
  db: PrismaClient;
};

export type DeleteBoardResult = {
  deletedBoard: {
    id: number;
  };
};

export async function deleteBoard({
  id,
  db,
}: DeleteBoardArgs): Promise<DeleteBoardResult> {
  const board = await db.board.delete({
    where: { id },
  });

  return {
    deletedBoard: {
      id: board.id,
    },
  };
}
