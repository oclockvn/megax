import { uniqBy } from "../helpers/array";
import { TeamMember } from "../models/team.model";

export type TeamDetailState = {
  members: TeamMember[];
  loading?: boolean;
  error?: string;
};

type TeamDetailAction =
  | {
      type: "set";
      payload: Partial<TeamDetailState>;
    }
  | {
      type: "toggleLeader";
      payload: number[];
    }
  | {
      type: "addMember";
      payload: TeamMember[];
    }
  | {
      type: "removeMember";
      payload: number;
    };

export default function teamDetailReducer(
  state: TeamDetailState,
  action: TeamDetailAction
) {
  const { type, payload } = action;
  switch (type) {
    case "set":
      return {
        ...state,
        ...payload,
      };
    case "toggleLeader":
      return {
        ...state,
        members: state.members.map(m => ({
          ...m,
          leader: payload.includes(m.memberId) ? !m.leader : m.leader,
        })),
      };
    case "addMember":
      return {
        ...state,
        members: uniqBy([...payload, ...state.members], "memberId"),
      };
    case "removeMember":
      return {
        ...state,
        members: state.members.filter(m => m.memberId !== payload),
      };
    default:
      return {
        ...state,
      };
  }
}
