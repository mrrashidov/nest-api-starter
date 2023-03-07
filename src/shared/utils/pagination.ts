import { CursorPaginateParamsInterface } from '~/global/pagination.interface';

export class KnexPagination {
  public static async cursorPaginate(params: CursorPaginateParamsInterface) {
    const { query, cursor, perPage = 10 } = params;
    const cursorMeta = {
      hasNextPage: false,
      next_cursor: null,
      hasPrevPage: false,
      prev_cursor: null,
    };
    const cursorColumn = cursor.key;
    const whereOperator = this.getWhereOperator(cursor.order, cursor.direction);
    // if cursor is null, we need to get the first/last page
    if (cursor.value) {
      query.where(cursorColumn, whereOperator, cursor.value);
    }
    // if direction is prev, we need to reverse the order
    const order =
      cursor.direction === 'next'
        ? cursor.order
        : cursor.order === 'asc'
        ? 'desc'
        : 'asc';
    // add +1 to the limit to determine if there is a next/prev page
    const result = await query.orderBy(cursorColumn, order).limit(perPage + 1);
    // if direction is prev, we need to reverse the result
    if (order !== cursor.order) {
      result.reverse();
    }
    // if we have more than perPage results, we have a next/prev page
    if (result.length > perPage) {
      if (cursor.direction === 'next') {
        result.pop();
        cursorMeta.hasNextPage = true;
        if (cursor.value) {
          cursorMeta.hasPrevPage = true;
          cursorMeta.prev_cursor = result[0][cursor.key];
        }
        cursorMeta.next_cursor = result[result.length - 1][cursor.key];
      } else {
        result.shift();
        cursorMeta.hasPrevPage = true;
        if (cursor.value) {
          cursorMeta.hasNextPage = true;
          cursorMeta.next_cursor = result[result.length - 1][cursor.key];
        }
        cursorMeta.prev_cursor = result[0][cursor.key];
      }
    } else if (result.length > 0 && result.length <= perPage) {
      if (cursor.direction === 'next') {
        if (cursor.value) {
          cursorMeta.hasPrevPage = true;
          cursorMeta.prev_cursor = result[0][cursor.key];
        }
      } else {
        if (cursor.value) {
          cursorMeta.hasNextPage = true;
          cursorMeta.next_cursor = result[result.length - 1][cursor.key];
        }
      }
    }

    return {
      data: result,
      meta: {
        cursor: cursorMeta,
        per_page: perPage,
      },
    };
  }

  private static getWhereOperator(order, direction) {
    if (order === 'asc') {
      if (direction === 'next') {
        return '>';
      } else {
        return '<';
      }
    } else {
      if (direction === 'prev') {
        return '>';
      } else {
        return '<';
      }
    }
  }
}
