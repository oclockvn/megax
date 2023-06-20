// import api from "@/lib/api";
import { Filter, PagedResult, Result } from "../models/common.model";

import { User } from "../models/user.model";
import { qs } from "../until";
import api from "./axios.instance";


export async function fetchUserList(filter: Partial<Filter>) {
    const res = await api.get<PagedResult<User>>("/be/users?" + qs(filter));

    return res.data;
}

export async function fetchUserDetail(id: number) {
    const res = await api.get<User>("/be/users/" + id);

    return res.data;
}

export async function updateUserDetail(user: User) {
    const res = await api.post<Result<User>>("/be/users/" + user.id, { user });
    return res.data;
}
