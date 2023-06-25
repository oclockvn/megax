import { Filter, PagedResult } from '../models/common.model'
import { User } from '../models/user.model'
import { qs } from '../until'
import api from './api'


export async function fetchUserList(filter: Partial<Filter>) {
    const res = await api.get<PagedResult<User>>('api/users?' + qs(filter))
    return res.data
}


// export async function fetchUserDetail(id: number) {
//     const res = await api.get<User>('api/users/' + id)
//     return res.data


// }


// export async function updateUserDetail(user: User) {
//     const res = await api.post<User>('api/users/' + user.id)
//     return res.data

// }