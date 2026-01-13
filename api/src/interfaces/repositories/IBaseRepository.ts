import { PaginatedResponse } from "../../types/index.js";

export interface FindManyOptions {
  page?: number;
  limit?: number;
  orderBy?: Record<string, "asc" | "desc">;
}

export interface IBaseRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>;
  findMany(options?: FindManyOptions): Promise<PaginatedResponse<T>>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<void>;
  count(where?: Record<string, unknown>): Promise<number>;
}
