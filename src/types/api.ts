/**
 * Type-safe API response types.
 *
 * Every API route returns `ApiResponse<T>` for single items or
 * `PaginatedResponse<T>` for lists. This ensures the frontend always
 * knows the exact shape of the response body.
 */

/** Successful API response with data */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** Error API response */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  };
}

/** Union type — every API route returns this */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

/** Query parameters for list endpoints */
export interface ListQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | undefined;
}
