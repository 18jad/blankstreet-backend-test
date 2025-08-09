export interface Page<T> {
    data: T[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

