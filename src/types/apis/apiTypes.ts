export interface ResourceIdentifier {
    id: string;
    type: string;
}

export interface Relationship {
    data: ResourceIdentifier | ResourceIdentifier[];
}

export interface Resource<T> {
    id: string;
    type: string;
    attributes: T;
    relationships?: Record<string, Relationship>;
}

export interface ApiResponse<T> {
    data: Resource<T> | Resource<T>[];
    included?: Resource<any>[];
    meta?: Meta;
    message?: string;
    status?: number;
}

export interface Meta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
}

export interface PaginationParams {
    page: number;
    perPage: number;
    include?: string;
}

export interface PaginationState {
    page: number;
    perPage: number;
    total: number;
}