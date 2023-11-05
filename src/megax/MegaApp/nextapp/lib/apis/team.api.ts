import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { extractErrors } from "../helpers/response";
import { Team, TeamQueryInclude } from "../models/team.model";

export async function getTeams(include?: TeamQueryInclude) {
  const res = await api.get<Team[]>("api/teams" + (include != null ? `?include=${include}` : ''));
  return res.data;
}

export async function getTeam(id: number) {
  const res = await api.get<Team>("api/teams/" + id);
  return res.data;
}

export async function createTeam(team: Team) {
  try {
    const res = await api.post<Result<Team>>("api/teams", { team });
    return res.data;
  } catch (err) {
    return {
      code: extractErrors(err),
      success: false,
    } as Result<Team>;
  }
}

export async function updateTeam(team: Team) {
  try {
    const res = await api.post<Result<Team>>(`api/teams/${team.id}`, { team });
    return res.data;
  } catch (err) {
    return {
      code: extractErrors(err),
      success: false,
    } as Result<Team>;
  }
}
