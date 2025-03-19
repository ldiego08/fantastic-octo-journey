"use client";

import { BoardDetails } from "@/components/BoardDetails";
import { BoardsTree } from "@/components/BoardsTree";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const client = new QueryClient();
  const [selectedBoard, setSelectedBoard] = useState<number | undefined>();

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <QueryClientProvider client={client}>
        {/* <WebSocketDemo /> */}

        <div className="flex flex-row gap-2 m-6">
          <BoardsTree onSelect={setSelectedBoard} />
          <BoardDetails boardId={selectedBoard} />
        </div>
      </QueryClientProvider>
    </main>
  );
}
