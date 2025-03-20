import { Board, PrismaClient } from "@prisma/client";

export type GetBoardsArgs = {
  db: PrismaClient;
};

export type GetBoardsResult = {
  boards: BoardWithChildren[];
};

export type BoardWithChildren = Board & { children: Board[] };

export async function getBoards({
  db,
}: GetBoardsArgs): Promise<GetBoardsResult> {
  const boards = await db.board.findMany();
  const boardMap = new Map<number, BoardWithChildren>();

  boards.forEach((board) => {
    boardMap.set(board.id, { ...board, children: [] });
  });

  const tree: BoardWithChildren[] = [];

  boardMap.forEach((board) => {
    if (board.parentId) {
      const parent = boardMap.get(board.parentId);

      if (parent) {
        parent.children.push(board);
      }
    } else {
      tree.push(board);
    }
  });

  return {
    boards: tree,
  };
}
