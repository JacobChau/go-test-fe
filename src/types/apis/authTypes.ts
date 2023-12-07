export interface AccessTokenPayload {
    accessToken: string;
}

export interface CredentialsPayload extends AccessTokenPayload {
    refreshToken?: string;
}

export interface EmailPasswordParams {
    email: string;
    password: string;
}

export interface CredentialsParams extends EmailPasswordParams {
    rememberMe?: boolean;
}

export interface RegisterParams extends EmailPasswordParams {
    name: string;
}

export interface RefreshTokenParams {
    refreshToken: string;
}

export interface ForgotPasswordParams {
    email: string;
}

export interface GoogleLoginParams {
    accessToken: string;
}
