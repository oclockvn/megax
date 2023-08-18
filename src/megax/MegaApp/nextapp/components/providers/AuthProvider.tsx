"use client";

import React, { createContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useAuth from "@/lib/auth/useAuth";
import { redirect } from "next/navigation";

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

// 'use client';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const AuthContext = createContext<{ isAuthenticated: boolean; name: string }>(
    { isAuthenticated: false, name: "" }
  );

  const [isAuthenticated, name] = useAuth();
  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, name }}>
      {children}
    </AuthContext.Provider>
  );
};
