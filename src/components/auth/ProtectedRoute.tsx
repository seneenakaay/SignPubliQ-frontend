'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/services/auth.service';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Initial check
        const checkAuth = () => {
            const user = getUser();
            if (!user) {
                setIsAuthenticated(false);
                router.push('/login');
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();

        // Listen for storage changes across tabs
        const handleStorageChange = (event: StorageEvent) => {
            // Check for our custom logout event OR if token is removed
            if (event.key === 'logout-event') {
                setIsAuthenticated(false);
                router.push('/login');
            } else if (event.key === 'accessToken' || event.key === 'user') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [router]);

    // Show nothing while checking (or a loading spinner)
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
