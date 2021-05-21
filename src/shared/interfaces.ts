export interface PagedResponse<T> {
    items: T;
    totalCount: number;
    page: number;
    limit: number;
}