"use client";

import React, { createContext } from "react";
import useAuth, { useAccess } from "@/lib/auth/useAuth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

type AuthContextType = {
  isAuthenticated: boolean;
  name: string;
  roles: string[] | undefined;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  name: "",
  roles: [],
});

function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {

  const { authenticated, username: name } = useAuth();
  if (!authenticated) {
    redirect("/login");
  }

  const { hasAccess, roles, status } = useAccess(requiredRoles || []);
  if (status === "success" && !hasAccess) {
    redirect("/");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authenticated,
        name,
        roles: roles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default dynamic(() => Promise.resolve(ProtectedRoute), {
  ssr: false,
});
