import { useBoardsQuery } from "@/hooks";
import { Board } from "@/model";

export type BoardsTreeProps = {
  onSelect?: (boardId: number) => void;
};

export function BoardsTree({ onSelect }: BoardsTreeProps) {
  const boardsQuery = useBoardsQuery();

  if (boardsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3">
      <BoardsSubTree
        boards={boardsQuery.data?.boards || []}
        onSelect={onSelect}
      />
    </div>
  );
}

type BoardsSubTreeProps = {
  boards: Board[];
  onSelect?: (boardId: number) => void;
};

function BoardsSubTree({ boards, onSelect }: BoardsSubTreeProps) {
  return (
    <ul className="pl-4">
      {boards.map((board) => (
        <li key={board.id} className="mb-1">
          <button
            className="text-blue-500 hover:underline focus:outline-none"
            onClick={() => onSelect?.(board.id)}
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
