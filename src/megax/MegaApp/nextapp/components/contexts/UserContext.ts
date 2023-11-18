import { User } from "@/lib/models/user.model";
import { createContext } from "react";

type UserContextType = { user: User, updateUser: (user: Partial<User>) => void }
export const UserContext = createContext<UserContextType>({
  user: {} as User,
  updateUser: (_) => {}
})
