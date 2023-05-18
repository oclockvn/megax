"use client";

import { signIn } from "next-auth/react";

function SignInPage() {
  return (
    <>
      <div>Signin</div>

      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default SignInPage;
