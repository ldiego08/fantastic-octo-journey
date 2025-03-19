export type BoardDetailsProps = {
  boardId?: number;
};

export function BoardDetails({ boardId }: BoardDetailsProps) {
  if (!boardId) {
    return (
      <div className="bg-white rounded-xl shadow-lg text-lg p-3 flex-1">
        No board selected.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg text-lg p-3 flex-1">
      Board selected {boardId}
    </div>
  );
}
