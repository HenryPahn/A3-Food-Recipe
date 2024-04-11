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
            const history = await getHistory(token)
            const reverseHistory = history.slice().reverse();
            setReceipes(reverseHistory)
        }

        if (!isAuthenticated()) {
            router.push('/login')
        }

        fetchData()
    }, [])

    const handleView = (uri) => {
        router.push(`/recipes?uri=${uri}`);
    }

    const handleRemove = async (uri) => {
        let token = getToken()
        await removeHistory(token, uri)
        router.reload()
    }

    return (
        <>
            <h1>History</h1>
            {recipes?.length > 0 && recipes.map((attribute, index) => (
                <Card className="mx-auto my-3" style={{ width: '50%' }}>
                    <Row className="g-0">
                        <Col md={4}>
                            <Card.Img src={attribute.image} alt={attribute.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Col>
                        <Col md={8}>
                            <Card.Body>
                                <Card.Title><h3>{attribute.label}</h3></Card.Title>
                                <ul className="list-unstyled">
                                    <li>Cuisine: {attribute.cuisineType}</li>
                                    <li>Dish type: {attribute.dishType}</li>
                                    <li>Meal: {attribute.mealType}</li>
                                </ul>
                                <Button variant="primary" onClick={() => handleView(attribute.uri)}>View Recipe</Button>
                                <Button variant="primary" onClick={() => handleRemove(attribute.uri)}>Remove</Button>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            ))}
        </>
    );
}