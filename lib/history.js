export async function getHistory(token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }
    });
    const data = await res.json();
    return data;
}

export async function addHistory(token, history) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history/add`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }, 
        body: JSON.stringify({ history })
    });
    const data = await res.json();
    return data
}

export async function removeHistory(token, uri) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history/remove`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }, 
        body: JSON.stringify({ uri: uri })
    });
    const data = await res.json();
    return data;
}
