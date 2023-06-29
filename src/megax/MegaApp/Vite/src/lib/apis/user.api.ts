import { Filter, PagedResult } from '../models/common.model'
import { User } from '../models/user.model'
import { qs } from '../until'
import api from './api'

export async function fetchUserList(filter: Partial<Filter>) {
    const res = await api.get<PagedResult<User>>('api/users?' + qs(filter))
    return res.data
}
