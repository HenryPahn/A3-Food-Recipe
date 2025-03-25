import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/', '/login', '/register', '/search', '/resetPassword', '/_error'];
const AUTHENTICATE_PATH = ['/login', '/register', "/resetPassword"];

export default function RouteGuard(props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    // Wrap authCheck in useCallback so it's safe to use in useEffect
    const authCheck = useCallback((url) => {
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        } else {
            setAuthorized(true);
            if (isAuthenticated() && AUTHENTICATE_PATH.includes(path)) {
                router.push('/');
            }
        }
    }, [router]);

    useEffect(() => {
        authCheck(router.pathname);

        router.events.on('routeChangeComplete', authCheck);

        return () => {
            router.events.off('routeChangeComplete', authCheck);
        };
    }, [authCheck, router.events, router.pathname]); //include authCheck

    return <>{authorized && props.children}</>;
}
