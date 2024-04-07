import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { getToken, isAuthenticated, removeToken } from '@/lib/authenticate';
import { getHistory, removeHistory } from '@/lib/history';


export default function favourites() {
    const router = useRouter();
    const [recipes, setReceipes] = useState([])

    useEffect(() => {
        let fetchData = async () => {
            let token = getToken()
            const uri_data = await getHistory(token)

            let fetched_uri = ""
            uri_data.forEach(uri => {
                fetched_uri += "uri=" + uri + "&"
            })

            const app_id = process.env.APP_ID
            const app_key = process.env.APP_KEY
            const res = await fetch(`https://api.edamam.com/api/recipes/v2/by-uri?type=public&${fetched_uri}app_id=${app_id}&app_key=${app_key}&field=mealType&field=dishType&field=image&field=label&field=healthLabels&field=yield&field=calories&field=digest&field=cuisineType&field=ingredients&field=uri`);
            const data = await res.json()
            setReceipes(data.hits)
        }

        if (!isAuthenticated()) {
            router.push('/login')
        }

        fetchData()
    }, [])

    const handleView = (uri) => {
        router.push(`/recipes?uri=${encodeURIComponent(uri)}`);
    }

    const handleRemove = async (uri) => {
        let token = getToken()
        const data = await removeHistory(token, encodeURIComponent(uri))
        console.log(data)
        router.reload()
    }

    return (
        <>
            <h1>History</h1>
            {recipes?.length > 0 && recipes.map((attribute, index) => (
                <Card className="mx-auto my-3" style={{ width: '50%' }}>
                    <Row className="g-0">
                        <Col md={4}>
                            <Card.Img src={attribute.recipe.image} alt={attribute.recipe.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Col>
                        <Col md={8}>
                            <Card.Body>
                                <Card.Title><h3>{attribute.recipe.label}</h3></Card.Title>
                                <Card.Text>
                                    <ul className="list-unstyled">
                                        <li>Cuisine: {attribute.recipe.cuisineType}</li>
                                        <li>Dish type: {attribute.recipe.dishType}</li>
                                        <li>Meal: {attribute.recipe.mealType}</li>
                                    </ul>
                                </Card.Text>
                                <Button variant="primary" onClick={() => handleView(attribute.recipe.uri)}>View Recipe</Button>
                                <Button variant="primary" onClick={() => handleRemove(attribute.recipe.uri)}>Remove</Button>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            ))}
        </>
    );
}