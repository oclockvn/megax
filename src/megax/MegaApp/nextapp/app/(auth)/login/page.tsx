"use client";

import Button from "@mui/material/Button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const session = useSession();
  if (session.status === "authenticated") {
    redirect("/");
  }

  const provider = "google"; // currently we only support google

  return (
    <>
      <div>Signin</div>

      <Button variant="contained" onClick={() => signIn(provider)}>
        Sign in
      </Button>
    </>
  );
}
