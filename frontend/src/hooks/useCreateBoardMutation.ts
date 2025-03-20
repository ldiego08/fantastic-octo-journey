import { useMutation } from "@tanstack/react-query";

export const useCreateBoardMutation = () =>
  useMutation({
    mutationKey: ["board-create"],
    mutationFn: async ({
      name,
      parentId,
    }: {
      name: string;
      parentId: number | null;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/boards`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            parentId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      return json as {
        createdBoard: {
          id: number;
          parentId: number | null;
          name: string;
          depth: number;
        };
      };
    },
  });
