
'use client';

import React, { createContext } from "react";
import useAuth from "@/lib/auth/useAuth";
import { redirect } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
