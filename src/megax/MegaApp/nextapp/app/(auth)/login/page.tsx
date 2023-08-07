"use client";

// import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import { GoogleLogin, useGoogleLogin , hasGrantedAnyScopeGoogle } from "@react-oauth/google";

export default function SignInPage() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } =
    useAuth0();
    // const {} = use

    // hasGrantedAnyScopeGoogle()
  // const { status } = useSession();
  // const auth0Domain  = auth0Domain;

  if (isAuthenticated) {
    redirect("/");
  }


const googleLogin = useGoogleLogin({
  flow: 'auth-code',
  onSuccess: async (codeResponse) => {
    const { code } =codeResponse;
      console.log(codeResponse);
      // const token = await googl
      // const tokens = await axios.post(
      //     'http://localhost:3001/auth/google', {
      //         code: codeResponse.code,
      //     });

      // console.log(tokens);
  },
  onError: errorResponse => console.log(errorResponse),
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
