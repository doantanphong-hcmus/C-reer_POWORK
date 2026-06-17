export interface ApiSuccess<T> {
  status: 'success';
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  status: 'error';
  error_code: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
