"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./ProtectedRoute";

const googleAuthOption = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
}

export default function AuthProvider({
  children,
  useGuard = false,
}: {
  children: React.ReactNode;
  useGuard?: boolean;
}) {
  return (
    <GoogleOAuthProvider {...googleAuthOption}>
      {useGuard ? <ProtectedRoute>{children}</ProtectedRoute> : children}
    </GoogleOAuthProvider>
  );
}
