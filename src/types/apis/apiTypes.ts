export interface ResourceIdentifier {
    id: string;
    type: string;
}

export interface Identity {
    id: number;
}

export interface IdentityOptional {
    id?: number;
}

export interface Relationship {
    data: ResourceIdentifier | ResourceIdentifier[];
}

export interface Resource<T> {
    id: number;
    type: string;
    attributes: T;
    relationships?: Record<string, Relationship>;
}

export interface ApiResponse<T> {
    data: T;
    included?: Resource<never>[];
    meta?: Meta;
    message?: string;
    status?: number;
}

export interface AuthResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export interface Meta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
}

export interface QueryParams {
    page: number;
    perPage: number;
    searchType?: string;
    searchKeyword?: string;
    searchColumn?: string;
    filters?: object;
}


export interface PaginationState {
    page: number;
    perPage: number;
    total: number;
}