export interface Result<T> {
    data: T,
    isSuccess: boolean,
    code: string
}