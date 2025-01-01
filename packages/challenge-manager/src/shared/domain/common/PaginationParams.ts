export default class PaginationParams {
  public readonly page: number; 
  public readonly perPage: number;

  constructor(
    page?: number, 
    perPage?: number
  ) {
    this.page = page ?? 0;
    this.perPage = perPage ?? 10;
  }

  static create(params: { page?: number; perPage?: number }): PaginationParams {
    return new PaginationParams(params.page ?? 0, params.perPage ?? 10);
  }

  get skip(): number {
    return this.page * this.perPage;
  }

  get take(): number {
    return this.perPage + this.skip;
  }
}
