import { PrismaClient } from "@prisma/client";

export type DeleteBoardArgs = {
  id: number;
  db: PrismaClient;
};

export type DeleteBoardResult = {
  deletedBoard: {
    id: number;
    parentId: number | null;
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
      parentId: board.parentId,
    },
  };
}
