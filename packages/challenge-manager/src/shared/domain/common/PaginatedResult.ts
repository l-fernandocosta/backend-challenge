import PaginationParams from "@/shared/domain/common/PaginationParams";

export  default class PaginatedResult<T> {
  public readonly data: T[];
  public readonly totalItems: number;
  public readonly totalPages: number;
  public readonly currentPage: number;

  constructor(
    data: T[],
    totalItems: number,
    totalPages: number,
    currentPage: number
  ) {
    this.data = data;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
  }

  static create<T>(data: T[], totalItems: number, pagination: PaginationParams): PaginatedResult<T | any> {
    const totalPages = Math.ceil(totalItems / pagination.perPage);
    return new PaginatedResult(data, totalItems, totalPages, pagination.page);
  }
}
