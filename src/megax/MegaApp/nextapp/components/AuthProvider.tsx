"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;
