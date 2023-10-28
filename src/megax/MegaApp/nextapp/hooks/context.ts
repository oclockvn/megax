import { createContext } from "react";

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
