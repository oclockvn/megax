"use client";

import { useSession, signIn, signOut } from "next-auth/react";

function SignInPage() {
  return (
    <>
      <div>Signin</div>

      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default SignInPage;
