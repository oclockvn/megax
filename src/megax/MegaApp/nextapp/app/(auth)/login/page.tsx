"use client";

import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import {
  useGoogleLogin,
} from "@react-oauth/google";
import storage from "@/lib/storage";
import { googleSignIn } from "@/lib/apis/signin.api";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter()
  const [error, setEror] = useState("");

  const googleLogin = useGoogleLogin({
    // flow: "auth-code",
    flow: 'implicit',
    onSuccess: async codeResponse => {
      // console.log(codeResponse);
      // const { code } = codeResponse;
      const resp = await googleSignIn(codeResponse.access_token);
      if (resp.success) {
        storage.set('token', resp.data.token);
        storage.set('refresh-token', resp.data.refreshToken);

        router.replace("/");
      }
    },
    onError: errorResponse =>
      setEror(
        errorResponse.error_description ||
          "Unable to login using your google account"
      ),
  });

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
          {error?.length > 0 && <Alert severity="info">{error}</Alert>}

          <Button
            variant="contained"
            className="!bg-blue-500 w-full"
            onClick={() => googleLogin()}
          >
            <GoogleIcon className="mr-4" />
            Sign in using Google
          </Button>
        </div>
      </div>
    </div>
  );
}
