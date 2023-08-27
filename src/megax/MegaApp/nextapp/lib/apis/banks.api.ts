import api from "@/lib/api";
import { Filter, PagedResult } from "@/lib/models/common.model";
import { qs } from "../util";
import { Bank } from "../models/bank.model";

export async function fetchBanks(filter: Partial<Filter> | undefined) {
  const query = filter ? qs(filter) : "";
  const res = await api.get<PagedResult<Bank>>("/api/banks?" + query);
  return res.data;
}
