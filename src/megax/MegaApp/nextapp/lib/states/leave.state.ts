import { Leave } from "../models/leave.model";

export type LeavePageState = {
  items: Leave[];
  capacity: number;
  loading: boolean;
  showDrawer: boolean;
  leave: Partial<Leave> | null;
};

type Action =
  | {
      type: "set";
      payload: Partial<LeavePageState>;
    }
  | {
      type: "submitted";
      payload: Leave;
    }
  | {
      type: "cancel";
      payload: number;
    };

export default function leavePageReducer(
  state: LeavePageState,
  action: Action
) {
  const { type, payload } = action;

  switch (type) {
    case "set":
      return {
        ...state,
        ...payload,
      } as LeavePageState;
    case "submitted":
      return {
        ...state,
        items: [payload, ...state.items],
        showDrawer: false,
      } as LeavePageState;
    case "cancel":
      return {
        ...state,
        items: state.items.filter(i => i.id !== payload),
      } as LeavePageState;
  }
}
