'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Check for access token in localStorage or sessionStorage
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        if (accessToken) {
            router.push('/dashboard');
        }
    }, [router]);

    return null;
}
