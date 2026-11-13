import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBoards } from "@/lib/board/board-actions";
import { BoardList } from "@/components/board/board-list";

export default async function BoardsPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user) redirect("/login");

  const boards = await getBoards();
  return <BoardList boards={boards as any} />;
}
