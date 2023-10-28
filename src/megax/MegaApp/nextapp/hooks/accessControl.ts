import { useContext } from "react";
import { AuthContext } from "./context";
import { hasRoles } from "@/lib/auth/useAuth";

export type ACLKey = "leave.approve" | "leave.reject";

type ACLType = {
  [key in ACLKey]: {
    roles: string[];
    permissions: string[];
  };
};
export const ACL: ACLType = {
  "leave.approve": {
    roles: ["sa", "admin", "leader"],
    permissions: [],
  },
  "leave.reject": {
    roles: ["sa", "admin", "leader"],
    permissions: [],
  },
};

export default function hasAccess(feature: ACLKey): boolean {
  const { roles } = useContext(AuthContext);
  return hasRoles(ACL[feature].roles, roles);
}
