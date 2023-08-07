"use client";

import { googleClientId } from "@/lib/config";
import React, { createContext, useContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useAuth from "@/lib/auth/useAuth";
import { redirect } from "next/navigation";
import NoSSR from "../NoSSR";

export default function AuthProvider({
  children,
  useGuard = false,
}: {
  children: React.ReactNode;
  useGuard?: boolean;
}) {
  console.log('google client id', googleClientId);
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {useGuard ? <ProtectedRoute>{children}</ProtectedRoute> : children}
    </GoogleOAuthProvider>
  );
}

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
