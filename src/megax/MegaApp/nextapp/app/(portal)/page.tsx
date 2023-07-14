"use client";

import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  return (
    <>
      Is authenticated: {isAuthenticated}
      User: {user ? JSON.stringify(user) : ""}
    </>
  );
}
