export type UserInfoState = {
  loading: boolean;
  loadingState: string | null;
  error: string | null;
};

type Action = {
  type: "patch";
  payload: Partial<UserInfoState>;
};

export default function userInfoReducer(state: UserInfoState, action: Action) {
  switch (action.type) {
    case "patch":
      return {
        ...state,
        ...action.payload,
      } as UserInfoState;
  }
}
