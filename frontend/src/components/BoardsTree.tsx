import { Board } from "@/model";

export type BoardsTreeProps = {
  boards: Board[];
  onSelect?: (board: Board) => void;
};

export function BoardsTree({ boards, onSelect }: BoardsTreeProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg pl-5 pr-5 pt-3 pb-3">
      <BoardsSubTree boards={boards} onSelect={onSelect} />
    </div>
  );
}

type BoardsSubTreeProps = {
  boards: Board[];
  onSelect?: (board: Board) => void;
};

function BoardsSubTree({ boards, onSelect }: BoardsSubTreeProps) {
  return (
    <ul className="pl-4">
      {boards.map((board) => (
        <li key={board.id} className="mb-1">
          <button
            className="text-blue-500 hover:underline focus:outline-none"
            onClick={() => onSelect?.(board)}
          >
            {board.name}
          </button>
          {board.children && board.children.length > 0 && (
            <BoardsSubTree boards={board.children} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
}
