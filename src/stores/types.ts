export interface AuthState {
    isLoading: boolean;
    isLoggedIn: boolean;
}

export interface MessageState {
    message?: string;
    isError?: boolean;
    timer?: NodeJS.Timeout;
}

export interface CustomizationState {
    isOpen: string;
    navType: string;
}