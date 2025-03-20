import {
  useBoardsQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useSocket,
} from "@/hooks";
import { Board } from "@/model";
import { useBoardStore } from "@/store";
import { useEffect } from "react";

export type BoardCreatedData = {
  createdBoard: {
    id: number;
    name: string;
    depth: number;
    parentId: number;
  };
};

export type UseDashboardState =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      boards: Board[];
      selectedBoard: Board | null;
      setSelectedBoard: (boardId: Board | null) => void;
      createBoard: (parentBoardId: number | null) => void;
      deleteBoard: (boardId: number) => void;
    };

export function useDashboardState(): UseDashboardState {
  const store = useBoardStore();
  const socket = useSocket();

  const { data, isLoading, status, refetch } = useBoardsQuery();
  const createBoardMutation = useCreateBoardMutation();
  const deleteBoardMutation = useDeleteBoardMutation();

  useEffect(() => {
    if (status === "success") {
      store.setBoards(data.boards);
    }
  }, [data, status]);

  useEffect(() => {
    if (!socket) return;

    const handleBoardCreated = async () => {
      // TODO: manually update store instead of refetching
      await refetch();
    };

    const handleBoardDeleted = async () => {
      // TODO: manually update store instead of refetching
      await refetch();
    };

    socket.on("board-created", handleBoardCreated);
    socket.on("board-deleted", handleBoardDeleted);

    return () => {
      socket.off("board-created", handleBoardCreated);
      socket.off("board-deleted", handleBoardDeleted);
    };
  }, [refetch, socket]);

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

  const deleteBoard = async (boardId: number) => {
    // TODO: select parent board after delete
    await deleteBoardMutation.mutateAsync({ id: boardId });
  };

  return {
    isLoading: false,
    boards: data?.boards || [],
    selectedBoard: store.selectedBoard,
    setSelectedBoard,
    createBoard,
    deleteBoard,
  };
}
