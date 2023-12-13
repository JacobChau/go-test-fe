export interface AuthState {
    isLoading: boolean;
    isLoggedIn: boolean;
}

export interface MessageState {
    message?: string;
    isError?: boolean;
}

export interface CustomizationState {
    isOpen: string;
    navType: string;
}