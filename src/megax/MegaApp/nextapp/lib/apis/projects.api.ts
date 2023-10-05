import api from "@/lib/api";
import { Filter, PagedResult } from "@/lib/models/common.model";
import { qs } from "../util";
import { Project } from "../models/project.model";

export async function fetchProjects(filter: Partial<Filter> | undefined) {
  const query = filter ? qs(filter) : "";
  const res = await api.get<PagedResult<Project>>("/api/projects?" + query);
  return res.data;
}
