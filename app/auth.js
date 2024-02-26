import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Add more robust validation or token decoding here if needed
        if (!token) {
            router.push('/login');
        }
    }, [router]);
};

const checkTokenExpiry = () => {
    const tokenExpiry = localStorage.getItem('token_expires_in');
    if (!tokenExpiry || Date.now() >= tokenExpiry) {
        // Token is expired or not set, redirect to login
        router.push('/login');
    }
};