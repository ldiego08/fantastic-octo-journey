import { useMutation } from "@tanstack/react-query";

export const useDeleteBoardMutation = () =>
  useMutation({
    mutationKey: ["board-delete"],
    mutationFn: async ({ id }: { id: number | null }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/boards/${id}`,
        {
          method: "DELETE",
        }
      );

      const json = await res.json();

      return json as {
        deletedBoard: {
          id: number;
          parentId: number | null;
        };
      };
    },
  });
