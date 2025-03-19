import { PrismaClient } from "@prisma/client";
import { ActionResult } from "./types";

export type DeleteBoardArgs = {
  id: number;
  db: PrismaClient;
};

export type DeleteBoardResult = ActionResult<{
  deletedBoard: {
    id: number;
  };
}>;

export async function deleteBoard({
  id,
  db,
}: DeleteBoardArgs): Promise<DeleteBoardResult> {
  try {
    const board = await db.board.delete({
      where: { id },
    });

    return {
      success: true,
      data: {
        deletedBoard: {
          id,
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
