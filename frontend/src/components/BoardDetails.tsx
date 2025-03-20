import { Board } from "@/model";
import { Button } from "./Button";

export type BoardDetailsProps = {
  board: Board | null;
  onCreate?: (parentBoardId: number) => void;
  onDelete?: (boardId: number) => void;
  onSelectChild?: (childBoard: Board) => void;
};

export function BoardDetails({
  board,
  onCreate,
  onDelete,
  onSelectChild,
}: BoardDetailsProps) {
  if (!board) {
    return (
      <div className="bg-white rounded-xl shadow-lg text-lg p-3 flex-1">
        No board selected.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg text-lg pl-5 pr-5 pt-3 pb-3 flex-1">
      <div className="flex flex-row justify-between">
        <h1 className="text-gray-900">🗂️ {board.name}</h1>
        <div className="flex gap-2">
          <Button onClick={() => onCreate?.(board.id)}>+ Add</Button>
          <Button onClick={() => onDelete?.(board.id)}>Remove</Button>
        </div>
      </div>
      <div className="text-sm text-gray-700 mt-5">
        Boards ({board.children.length})
      </div>
      <div className="grid grid-cols-4 mt-3 gap-3">
        {board.children.map((childBoard) => (
          <div
            key={childBoard.id}
            className="bg-gray-200 rounded-md p-5 text-gray-900 text-sm font-bold hover:bg-gray-300 cursor-pointer"
            onClick={() => onSelectChild?.(childBoard)}
          >
            {childBoard.name}
          </div>
        ))}
      </div>
    </div>
  );
}
