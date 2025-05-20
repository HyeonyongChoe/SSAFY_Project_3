export interface ErrorResponse {
  code: number;
  message: string;
}

export interface ResponseDto<T> {
  success: boolean;
  error: ErrorResponse | null;
  data: T;
}
