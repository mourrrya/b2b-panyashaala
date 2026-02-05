export interface SuccessRes<T> {
  data?: T;
  success: boolean;
}

// lib/types/api.ts
export interface GetListServerRes<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetServerRes<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateServerRes<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UpdateServerRes<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface DeleteServerRes<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ErrorServerRes {
  success: false;
  message?: string;
  errors?: Record<string, string[]>;
}
