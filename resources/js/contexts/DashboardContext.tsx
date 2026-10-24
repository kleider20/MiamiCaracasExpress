import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { logout as logoutRoute } from '@/routes';
import type { DashboardSection } from '@/types';

type DashboardContextValue = {
    section: DashboardSection;
    setSection: (section: DashboardSection) => void;
    orderQuery: string;
    setOrderQuery: (query: string) => void;
    searchOrders: (query: string) => void;
    loggedOut: boolean;
    logout: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const SECTION_QUERY = 'section';

function readSectionFromUrl(fallback: DashboardSection): DashboardSection {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const value = new URLSearchParams(window.location.search).get(
        SECTION_QUERY,
    ) as DashboardSection | null;

    return value ?? fallback;
}

function persistSection(section: DashboardSection): void {
    if (typeof window === 'undefined') {
        return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set(SECTION_QUERY, section);
    window.history.replaceState(window.history.state, '', url);
}

function readXsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export function DashboardProvider({
    initialSection,
    children,
}: {
    initialSection: DashboardSection;
    children: ReactNode;
}) {
    const [section, setSectionState] = useState<DashboardSection>(() =>
        readSectionFromUrl(initialSection),
    );
    const [orderQuery, setOrderQuery] = useState('');
    const [loggedOut, setLoggedOut] = useState(false);

    const setSection = useCallback((nextSection: DashboardSection) => {
        setSectionState(nextSection);
        persistSection(nextSection);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const searchOrders = useCallback((query: string) => {
        setOrderQuery(query);
        setSectionState('pedidos');
        persistSection('pedidos');
    }, []);

    const logout = useCallback(async () => {
        setLoggedOut(true);

        try {
            await fetch(logoutRoute().url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'text/html',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': readXsrfToken(),
                },
                body: '_token=',
            });
        } catch {
            // The goodbye screen still lets the customer return to the login page.
        }
    }, []);

    useEffect(() => {
        const onPopState = () => {
            setSectionState(readSectionFromUrl(initialSection));
        };

        window.addEventListener('popstate', onPopState);

        return () => window.removeEventListener('popstate', onPopState);
    }, [initialSection]);

    const value = useMemo<DashboardContextValue>(
        () => ({
            section,
            setSection,
            orderQuery,
            setOrderQuery,
            searchOrders,
            loggedOut,
            logout,
        }),
        [section, setSection, orderQuery, searchOrders, loggedOut, logout],
    );

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard(): DashboardContextValue {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error(
            'useDashboard debe usarse dentro de DashboardProvider.',
        );
    }

    return context;
}
