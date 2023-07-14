// import { useSession } from "next-auth/react";

export default function useAuth() {
  // const auth = useSession();
  // return [auth.status === "authenticated", auth.data?.user?.name || ""];
  return [false, ""];
}
