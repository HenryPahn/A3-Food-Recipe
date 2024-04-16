export async function getMealPlan(token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/mealPlan`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }
    });
    const data = await res.json();
    return data;
}

export async function updateMealPlan(token, mealPlan) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/mealPlan/add`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }, 
        body: JSON.stringify({ mealPlan: mealPlan})
    });
    const data = await res.json();
    return data;
}

export async function removeMealPlan(token, mealPlan) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/mealPlan/remove`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }, 
        body: JSON.stringify({ mealPlan: mealPlan})
    });
    const data = await res.json();
    return data;
}

export async function clearMealPlan(token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/mealPlan/removeAll`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${token}`
        }
    });
    const data = await res.json();
    return data;
}