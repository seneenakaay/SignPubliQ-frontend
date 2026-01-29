import CryptoJS from 'crypto-js';

const SECRET_KEY = 'Zp9M4KxqT2A7uRsvfYJ8QdC5HnLwE6mBVa0rG1t3U=';

export const encrypt = (data: any): string => {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
};

export const decrypt = (ciphertext: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};
