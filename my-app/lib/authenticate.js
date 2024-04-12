import { jwtDecode } from "jwt-decode";

function setToken(token) {
    if (typeof localStorage !== 'undefined')
        localStorage.setItem('access_token', token);
}

export function getToken() {
    if (typeof localStorage !== 'undefined')
        return localStorage.getItem('access_token');
}

export function readToken() {
    const token = getToken();
    return token ? jwtDecode(token) : undefined;
}

export function isAuthenticated() {
    const token = readToken();
    return token ? true : false;
}

export function removeToken() {
    if (typeof localStorage !== 'undefined')
        localStorage.removeItem('access_token');
}

export async function authenticateUser(userName, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        body: JSON.stringify({ userName: userName, password: password }),
        headers: {
            "content-type": "application/json"
        }
    });

    const data = await res.json();

    if (res.status === 200) {
        setToken(data.token);
        return true;
    } else {
        throw new Error(data.message);
    }
}

export async function registerUser(userName, password, password2) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
        method: "POST",
        body: JSON.stringify({ userName: userName, password: password, password2: password2 }),
        headers: {
            "content-type": "application/json"
        }
    });

    const data = await res.json();
    
    if (res.status === 200) {
        return true;
    } else {
        throw new Error(data.message);
    }
}