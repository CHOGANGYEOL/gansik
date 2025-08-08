export interface CommonResponse<T = unknown> {
  message: string;
  data: T;
}
