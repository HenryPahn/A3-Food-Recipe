import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';
import { route } from 'fontawesome';

const PUBLIC_PATHS = ['/', '/login', '/register', '/search', '/resetPassword','/_error'];
const AUTHENTICATE_PATH = ['/login', '/register', "/resetPassword"]

export default function RouteGuard(props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(router.pathname);

        router.events.on('routeChangeComplete', authCheck);

        return () => {
            router.events.off('routeChangeComplete', authCheck);
        };
    }, [router.events, router.pathname]);

    function authCheck(url) {
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        } else {
            setAuthorized(true);
            if(isAuthenticated() && AUTHENTICATE_PATH.includes(path))
                router.push("/")
        }
    }

    return <>{authorized && props.children}</>
}

