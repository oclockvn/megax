import { User } from "../models/user.model";

export type UserRecord = Pick<User, "id" | "fullName" | "email"> & {
  selected?: boolean;
};

export type UserSelectorState = {
  users: UserRecord[];
  keyword?: string;
  rand: number;
};

type _Action =
  | {
      type: "toggle";
      payload: number[];
    }
  | {
      type: "set";
      payload: UserRecord[];
    }
  | {
      type: "reload";
      payload: { keyword: string; rand: number };
    };

export default function userSelectorReducer(
  state: UserSelectorState,
  action: _Action
) {
  const { type, payload } = action;
  let users: UserRecord[] = [];

  switch (type) {
    case "set":
      users = [...payload];
      break;
    case "toggle":
      users = state.users.map(u => ({
        ...u,
        selected: action.payload.includes(u.id || 0) ? !u.selected : u.selected,
      }));
      break;
    case "reload":
      return {
        ...state,
        keyword: payload.keyword,
        rand: payload.rand,
      };
  }

  return {
    ...state,
    users,
  };
}
