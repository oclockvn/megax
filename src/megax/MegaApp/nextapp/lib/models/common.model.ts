export interface Result<T> {
  code: string;
  data: T;
  isSuccess: boolean;
}
