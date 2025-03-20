"use client";

import { Dashboard } from "@/components/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Home() {
  const client = new QueryClient();

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <QueryClientProvider client={client}>
        <Dashboard />
      </QueryClientProvider>
    </main>
  );
}
