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
    data: T;
    included?: Resource<any>[];
    meta?: Record<string, any>;
    message?: string;
    status?: number;
}