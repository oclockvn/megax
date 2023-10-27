"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./ProtectedRoute";

const googleAuthOption = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
};

type AuthProviderProps = {
  children: React.ReactNode;
  useGuard?: boolean;
  requiredRoles?: string[];
};

export default function AuthProvider({
  children,
  useGuard = false,
  requiredRoles,
}: AuthProviderProps) {
  return (
    <GoogleOAuthProvider {...googleAuthOption}>
      {useGuard ? (
        <ProtectedRoute requiredRoles={requiredRoles}>
          {children}
        </ProtectedRoute>
      ) : (
        children
      )}
    </GoogleOAuthProvider>
  );
}
