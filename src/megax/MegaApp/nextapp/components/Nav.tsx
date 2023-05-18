"use client";

import Button from "@mui/material/Button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  return (
    <>
      <nav>
        <Link href="/">Home</Link>
        {isAuthenticated ? (
          <>
            <span>Hi {session.data?.user?.name}</span>

            <Button variant="contained" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <></>
        )}
      </nav>
    </>
  );
}
