import { Filter, PagedResult } from "../models/common.model";
import { Supplier } from "../models/supplier.model";
import { qs } from "../until";
import api from "./api";

export async function fetchSupplierList(filter: Partial<Filter> | undefined) {
  const query = filter ? qs(filter) : "";
  const res = await api.get<PagedResult<Supplier>>("/api/suppliers?" + query);
  return res.data;
}
