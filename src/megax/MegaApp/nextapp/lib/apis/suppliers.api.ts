import api from "@/lib/api";
import { Filter, PagedResult } from "@/lib/models/common.model";
import { qs } from "../util";
import { Supplier } from "../models/supplier.model";

export async function fetchSupplierList(filter: Partial<Filter> | undefined) {
  const query = filter ? qs(filter) : "";
  const res = await api.get<PagedResult<Supplier>>("/api/suppliers?" + query);
  return res.data;
}
