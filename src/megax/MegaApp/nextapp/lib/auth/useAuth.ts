import jwt_decode from "jwt-decode";
import storage from "../storage";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserRolesAndPermissions } from "../apis/user.api";

type AuthResult = {
  authenticated: boolean;
  username: string;
};

export default function useAuth(): AuthResult {
  const token = storage.get("token");
  if (token) {
    const jwt = jwt_decode<Record<string, any>>(token);
    if (jwt && typeof jwt === "object") {
      if (!expired(Number(jwt["exp"]))) {
        const name =
          jwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

        return {
          authenticated: true,
          username: name,
        };
      }
    }
  }

  return {
    authenticated: false,
    username: "",
  };
}

const expired = (exp: number) => Date.now() >= exp * 1000;

export const useAccess = (
  requiredRoles: string[]
): {
  status: "error" | "success" | "pending";
  hasAccess: boolean;
  roles?: string[];
} => {
  const requireCheck = Number(requiredRoles?.length) > 0;
  const { data, status } = useQuery({
    queryKey: ["roles-and-permissions"],
    queryFn: () => getCurrentUserRolesAndPermissions(),
    // enabled: requireCheck,
    staleTime: Infinity,
  });

  const userRoles = data?.roles?.map(r => r.role?.toLowerCase() || "") || [];
  if (!requireCheck) {
    return {
      status: "success",
      hasAccess: true,
      roles: userRoles,
    };
  }

  if (status !== "success") {
    return {
      status,
      hasAccess: false,
      roles: userRoles,
    };
  }

  const required = requiredRoles?.map(r => r.toLowerCase()) || [];
  const canAccess = hasAccess(required, userRoles);

  return {
    status,
    hasAccess: canAccess,
    roles: userRoles,
  };
};

export const hasAccess = (requiredRoles?: string[], ownRoles?: string[]) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const roles = ownRoles?.map(r => r.toLowerCase()) || [];
  const has =
    requiredRoles?.some(r => roles.includes(r.toLowerCase())) === true;

  return has;
};
