"use client";

import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  return (
    <>
      Is authenticated: <div>{isAuthenticated ? "true" : "false"}</div>
      User: <pre>{user ? JSON.stringify(user) : ""}</pre>
    </>
  );
}
