import { useBoardsQuery, useCreateBoardMutation } from "@/hooks";
import { Board } from "@/model";
import { useBoardStore } from "@/store";
import { useEffect } from "react";

export type UseDashboardState =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      boards: Board[];
      setSelectedBoard: (boardId: Board | null) => void;
      selectedBoard: Board | null;
      createBoard: (parentBoardId: number | null) => void;
    };

export function useDashboardState(): UseDashboardState {
  const store = useBoardStore();
  const { data, isLoading, status } = useBoardsQuery();
  const createBoardMutation = useCreateBoardMutation();

  useEffect(() => {
    if (status === "success") {
      store.setBoards(data.boards);
    }
  }, [data, status]);

  if (isLoading) {
    return {
      isLoading: true,
    };
  }

  const setSelectedBoard = (board: Board | null) => {
    return store.setSelectedBoard(board);
  };

  const createBoard = async (parentBoardId: number | null) => {
    const boardName = prompt("Enter board name");

    if (boardName && boardName.trim()) {
      await createBoardMutation.mutateAsync({
        name: boardName,
        parentId: parentBoardId,
      });
    }
  };

  return {
    isLoading: false,
    boards: data?.boards || [],
    selectedBoard: store.selectedBoard,
    setSelectedBoard,
    createBoard,
  };
}
