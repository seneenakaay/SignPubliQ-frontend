
import axios from 'axios';
import { encrypt, decrypt } from '@/utils/crypto';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // 1. Attach Token
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // 2. Encrypt Data (if method is POST, PUT, PATCH and data exists)
        if (config.data && ['post', 'put', 'patch'].includes(config.method || '')) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
            config.data = { data: encrypt(config.data) };
        } else {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        const responseData = response.data;
        console.log(`[API Response Raw]`, responseData);

        // 1. Decrypt Data if exists
        let decodedResponse = responseData;
        if (responseData.data) {
            decodedResponse = decrypt(responseData.data);
            console.log(`[API Response Decrypted]`, decodedResponse);
        }

        // Return the decrypted/merged data directly
        // This allows consuming code to just do `const data = await api.get(...)`
        return { ...responseData, ...decodedResponse };
    },
    (error) => {
        console.error('API Request Failed:', error.response || error.message);
        // Return a rejected promise with a standard error object
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;
