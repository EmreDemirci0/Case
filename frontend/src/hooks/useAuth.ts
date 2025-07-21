import { useState, useEffect } from 'react';
import { decodeToken } from '../features/auth/services/authService';

interface AuthData {
    token: string | null;
    userId: number | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
}

export const useAuth = (): AuthData => {
    const [authData, setAuthData] = useState<AuthData>({
        token: null,
        userId: null,
        isAuthenticated: false,
        isAuthLoading: true, // başlangıçta loading true
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = decodeToken(token);
                setAuthData({
                    token,
                    userId: decodedToken?.userId || null,
                    isAuthenticated: !!decodedToken?.userId,
                    isAuthLoading: false,
                });
            } catch (error) {
                console.error('Token decode error:', error);
                setAuthData({
                    token: null,
                    userId: null,
                    isAuthenticated: false,
                    isAuthLoading: false,
                });
            }
        } else {
            setAuthData({
                token: null,
                userId: null,
                isAuthenticated: false,
                isAuthLoading: false,
            });
        }
    }, []);

    return authData;
};
