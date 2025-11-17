// useSessionRefresh.ts
import { useSession } from "next-auth/react";

export function useSessionRefresh() {
  const { data: session, update } = useSession();

  async function refreshSession() {
    await update(); // this triggers NextAuth to call the session callback again
  }

  return { session, refreshSession };
}
