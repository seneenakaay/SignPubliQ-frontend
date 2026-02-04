
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import { User, AuthResponse } from '@/types/auth';

export const initiateSignup = async (email: string) => {
    return api.post('/auth/initiate-signup', { email });
};

export const verifyEmail = async (email: string, otp: string) => {
    return api.post('/auth/verify-email', { email, otp });
};

export const completeSignup = async (data: any) => {
    const signupData = { ...data, roleTypeId: 1 };
    return api.post('/auth/signup', signupData);
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const data = { email, password, roleTypeId: 1 };
    const response = await api.post<any, AuthResponse>('/auth/login', data);

    if (response.accessToken) {
        console.log('[Login] Received Access Token:', response.accessToken);

        // Store tokens
        localStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('accessToken', response.accessToken);

        if (response.refreshToken) {
            console.log('[Login] Received Refresh Token:', response.refreshToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            sessionStorage.setItem('refreshToken', response.refreshToken);
        }

        // Decode user
        try {
            const user = jwtDecode<User>(response.accessToken);
            console.log('[Login] Decoded Access Token (User):', user);
            response.user = user;

            // Store user info
            localStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
            console.error('Failed to decode token', e);
        }
    }

    return response;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');

        // Notify other tabs by setting a storage event
        // We use setItem because removeItem might not fire if the key doesn't exist.
        // The value is just a timestamp to ensure it's always a "change".
        localStorage.setItem('logout-event', Date.now().toString());
    }
};

export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
    }
    return null;
};
