import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/', '/login', '/register', '/search', '/_error'];
const AUTHENTICATE_PATH = ['/login', '/register']

export default function RouteGuard(props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        authCheck(router.pathname);

        router.events.on('routeChangeComplete', authCheck);

        return () => {
            router.events.off('routeChangeComplete', authCheck);
        };
    }, []);

    function authCheck(url) {
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        } else {
            if(AUTHENTICATE_PATH.includes(path))
                router.push("/")
            setAuthorized(true);
        }
    }

    return <>{authorized && props.children}</>
}

