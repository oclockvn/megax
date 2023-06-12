export interface Result<T> {
  code: string;
  data: T;
  isSuccess: boolean;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export function EmptyPaged<T>(): PagedResult<T> {
  return { items: [], page: 0, pageSize: 0, total: 0 } as PagedResult<T>;
}

export class PageModel {
  constructor(page = 0, pageSize = 0) {
    this.page = page;
    this.pageSize = pageSize;
  }

  page: number;
  pageSize: number;
}

export declare type Filter = {
  query: string;
  sortBy: string;
  // isAsc: boolean;
  sortDir: string;
  page: number;
  pageSize: number;
};
