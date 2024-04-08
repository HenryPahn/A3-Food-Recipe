export async function getFavourites(token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/favourites`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }
    });
    const data = await res.json();
    return data;
}

export async function addFavourite(token, uri) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/favourites?uri=${uri}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }
    });
    const data = await res.json();
    return data
}

export async function removeFavourite(token, uri) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/favourites?uri=${uri}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }
    });
    const data = await res.json();
    return data;
}
