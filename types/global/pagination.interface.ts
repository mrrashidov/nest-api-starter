import { Knex } from 'knex';

export interface CursorPaginateParamsInterface {
  query: Knex.QueryBuilder;
  cursor: CursorInterface;
  perPage: number;
}

export interface CursorInterface {
  key: string;
  value?: string | number;
  order: 'asc' | 'desc';
  direction: 'next' | 'prev';
}

export interface cursorMetaInterface {
  hasNextPage: boolean;
  next_cursor: any;
  hasPrevPage: boolean;
  prev_cursor: any;
}

export interface KnexPaginationResponse<T> {
  data: T[];
  meta: {
    cursor: cursorMetaInterface;
    per_page: number;
  };
}
