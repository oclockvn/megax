"use client";

import React from "react";
import useAuth, { useAccess } from "@/lib/auth/useAuth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { AuthContext } from "@/hooks/context";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

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
