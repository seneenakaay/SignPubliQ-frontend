export interface User {
    user_id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    role_type_id: number;
    exp: number;
    iat: number;
}

export interface AuthResponse {
    message: string;
    accessToken?: string;
    refreshToken?: string;
    user?: User;
    [key: string]: any;
}
