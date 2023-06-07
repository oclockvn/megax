export interface UserLoginResponse {
    token: string,
    refreshToken: string,
    expiryTime: Date,
}

export interface Result<T> {
    data: T,
    isSuccess: boolean,
    code: string
}