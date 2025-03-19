import { Board } from "@/model";
import { useQuery } from "@tanstack/react-query";

export const useBoardsQuery = () =>
  useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/boards`
      );
      const json = await res.json();

      return json as {
        boards: Board[];
      };
    },
  });
