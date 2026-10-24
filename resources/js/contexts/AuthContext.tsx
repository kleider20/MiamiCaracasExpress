import type { VisitOptions } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { logout as logoutRoute } from '@/routes';
import { store as loginStore } from '@/routes/login';
import { store as registerStore } from '@/routes/register';
import type { SharedData, User } from '@/types';

export type LoginCredentials = {
    email: string;
    password: string;
    remember?: boolean;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginCredentials, options?: VisitOptions) => void;
    register: (payload: RegisterPayload, options?: VisitOptions) => void;
    logout: () => void;
    loadUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Global authentication state.
 *
 * The user is hydrated from the first Inertia page and kept in sync through
 * Inertia's `success` event, so the provider can live above every page while
 * still reacting to login, registration and logout visits.
 */
export function AuthProvider({
    initialUser,
    children,
}: {
    initialUser: User | null;
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [loading, setLoading] = useState(false);
    const previousUser = useRef<User | null>(initialUser);

    useEffect(() => {
        return router.on('success', (event) => {
            const props = event.detail.page.props as unknown as SharedData;

            setUser(props.auth?.user ?? null);
        });
    }, []);

    useEffect(() => {
        if (user && previousUser.current === null) {
            window.dispatchEvent(
                new CustomEvent('user-logged-in', { detail: { user } }),
            );
        }

        if (!user && previousUser.current !== null) {
            window.dispatchEvent(
                new CustomEvent('user-logged-out', {
                    detail: { user: previousUser.current },
                }),
            );
        }

        previousUser.current = user;
    }, [user]);

    const run = useCallback(
        (action: (options: VisitOptions) => void, options?: VisitOptions) => {
            setLoading(true);

            action({
                ...options,
                onFinish: (visit) => {
                    setLoading(false);
                    options?.onFinish?.(visit);
                },
            });
        },
        [],
    );

    const login = useCallback(
        (credentials: LoginCredentials, options?: VisitOptions) => {
            run(
                (visitOptions) =>
                    router.post(
                        loginStore().url,
                        { ...credentials },
                        visitOptions,
                    ),
                options,
            );
        },
        [run],
    );

    const register = useCallback(
        (payload: RegisterPayload, options?: VisitOptions) => {
            run(
                (visitOptions) =>
                    router.post(
                        registerStore().url,
                        { ...payload },
                        visitOptions,
                    ),
                options,
            );
        },
        [run],
    );

    const logout = useCallback(() => {
        run((visitOptions) =>
            router.post(logoutRoute().url, {}, visitOptions),
        );
    }, [run]);

    const loadUser = useCallback(() => {
        setLoading(true);
        router.reload({
            only: ['auth'],
            onFinish: () => setLoading(false),
        });
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            loading,
            login,
            register,
            logout,
            loadUser,
        }),
        [user, loading, login, register, logout, loadUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider.');
    }

    return context;
}
