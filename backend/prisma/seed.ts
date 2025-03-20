import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  let currentBoard = await db.board.create({
    data: { name: "Root Board", depth: 0 },
  });

  for (let i = 1; i <= 10; i++) {
    currentBoard = await db.board.create({
      data: {
        name: `Board Level ${i}`,
        parentId: currentBoard.id,
        depth: i,
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
