export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};
