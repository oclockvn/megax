"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { Typography } from "@mui/material";

export default function SignInPage() {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  if (isAuthenticated) {
    redirect("/");
  }

  const provider = "google"; // currently we only support google

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="border rounded-lg shadow p-8 bg-white">
        <Typography component="div" variant="h4" color={"#000"}>
          Sign In to MegaX
        </Typography>

        <div className="mt-4">
          <Button
            variant="contained"
            className="!bg-blue-500 w-full"
            onClick={() => signIn(provider)}
          >
            <GoogleIcon className="mr-4" />
            Sign in using Google
          </Button>
        </div>
      </div>
    </div>
  );
}
