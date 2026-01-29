import { encrypt, decrypt } from './crypto';
import { jwtDecode } from 'jwt-decode';

// TODO: Replace with env variable in production
const API_BASE_URL = 'http://localhost:5000/api/v1/auth';

interface User {
    user_id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    role_type_id: number;
    exp: number;
    iat: number;
}

interface AuthResponse {
    message: string;
    accessToken?: string;
    refreshToken?: string;
    user?: User; // We will manually populate this after decoding
    [key: string]: any;
}

class AuthService {
    private static getHeaders() {
        return {
            'Content-Type': 'application/json',
        };
    }

    private static async request(endpoint: string, method: string, body?: any): Promise<AuthResponse> {
        const url = `${API_BASE_URL}${endpoint}`;

        // Encrypt body if present
        const payload = body ? { data: encrypt(body) } : undefined;

        try {
            console.log(`[API Request] ${method} ${url}`, payload);

            const response = await fetch(url, {
                method,
                headers: this.getHeaders(),
                body: payload ? JSON.stringify(payload) : undefined,
            });

            const responseData = await response.json();
            console.log(`[API Response Raw]`, responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Something went wrong');
            }

            // Decrypt response if it contains "data"
            let decodedResponse = responseData;
            if (responseData.data) {
                decodedResponse = decrypt(responseData.data);
                console.log(`[API Response Decrypted]`, decodedResponse);
            } else if (responseData.message && Object.keys(responseData).length === 1) {
                // Sometimes it might just be a message without encryption? 
                // But docs say "Response: Returns { "data": "..." }". 
                // We'll assume if 'data' key exists, it's encrypted.
            }

            // Merge generic message if lost during decryption (unlikely if full object is encrypted)
            return { ...responseData, ...decodedResponse };

        } catch (error: any) {
            console.error('API Request Failed:', error);
            throw new Error(error.message || 'Network error');
        }
    }

    static async initiateSignup(email: string) {
        return this.request('/initiate-signup', 'POST', { email });
    }

    static async verifyEmail(email: string, otp: string) {
        return this.request('/verify-email', 'POST', { email, otp });
    }

    static async completeSignup(data: any) {
        // Ensure roleTypeId is set to 1 for frontend
        const signupData = { ...data, roleTypeId: 1 };
        return this.request('/signup', 'POST', signupData);
    }

    static async login(email: string, password: string) {
        const data = { email, password, roleTypeId: 1 };
        const response = await this.request('/login', 'POST', data);

        if (response.accessToken) {
            console.log('[Login] Received Access Token:', response.accessToken);

            // Store tokens
            localStorage.setItem('accessToken', response.accessToken);
            sessionStorage.setItem('accessToken', response.accessToken);

            if (response.refreshToken) {
                console.log('[Login] Received Refresh Token:', response.refreshToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                sessionStorage.setItem('refreshToken', response.refreshToken);

                try {
                    const decodedRefresh = jwtDecode(response.refreshToken);
                    console.log('[Login] Decoded Refresh Token:', decodedRefresh);
                } catch (e) {
                    console.error('[Login] Failed to decode refresh token:', e);
                }
            }

            // Decode user
            try {
                const user = jwtDecode<User>(response.accessToken);
                console.log('[Login] Decoded Access Token (User):', user);
                response.user = user;

                // Store user info if needed
                localStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.error('Failed to decode token', e);
            }
        }

        return response;
    }

    static logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
    }

    static getUser(): User | null {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
}

export default AuthService;
