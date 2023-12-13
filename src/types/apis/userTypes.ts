export interface UserAttributes  {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar: string;
    birthdate: string;
    role: string;
    emailVerifiedAt: string;
}

export interface CreateUserParams {
    name: string;
    email: string;
    role?: string;
    password: string;
    avatar?: string;
    birthdate?: string;
}

