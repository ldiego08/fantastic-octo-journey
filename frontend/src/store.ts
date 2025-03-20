import { create } from "zustand";
import { Board } from "./model";

type BoardStore = {
  boards: Board[];
  selectedBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  // addBoard: (name: string, parentId?: number) => void;
  setSelectedBoard: (board: Board | null) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  selectedBoard: null,
  setBoards: (boards: Board[]) => set((state) => ({ ...state, boards })),
  setSelectedBoard: (boardId: Board | null) =>
    set((state) => ({ ...state, selectedBoard: boardId })),
}));
