export interface UserAttributes  {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at?: string;
}

export interface CreateUserParams {
    name: string;
    email: string;
    password: string;
}

