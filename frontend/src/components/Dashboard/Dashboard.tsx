import { BoardDetails } from "../BoardDetails";
import { BoardsTree } from "../BoardsTree";

import { useDashboardState } from "./Dashboard.state";

export function Dashboard() {
  const state = useDashboardState();

  if (state.isLoading) {
    return <div className="flex flex-row gap-2 m-6">Loading...</div>;
  }

  return (
    <div className="flex flex-row gap-2 m-6">
      <BoardsTree boards={state.boards} onSelect={state.setSelectedBoard} />
      <BoardDetails board={state.selectedBoard} onCreate={state.createBoard} />
    </div>
  );
}
