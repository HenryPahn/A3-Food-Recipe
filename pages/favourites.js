
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { getToken} from '@/lib/authenticate';
import { getFavourites, removeFavourite, addFavourite } from '@/lib/favourite';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Favourites() {
    const router = useRouter();
    const [recipes, setReceipes] = useState([])

    useEffect(() => {
        let fetchData = async () => {
            let token = getToken()
            const favourites = await getFavourites(token)
            const reverseFavourites = favourites.slice().reverse();
            setReceipes(reverseFavourites)
        }

        fetchData()
    }, [recipes])

    const handleView = (uri) => {
        router.push(`/recipes/${uri}`);
    }

    const handleRemove = async (uri) => {
        let token = getToken()
        await removeFavourite(token, uri)
    }

    return (
        <>
            <h1>Favourites</h1>
            {recipes?.length > 0 && (
                <div>
                    {recipes.map((attribute, index) => (
                        index % 3 === 0 && (
                            <Row key={index}>
                                {recipes.slice(index, index + 3).map((item, i) => (
                                    <Col md={4} key={i} className="mb-4">
                                        <Card className="mx-auto pop-up-heading" style={{ width: '100%', height: "250px" }} onClick={() => handleView(item.uri)}>
                                            <Row className="g-0">
                                                <Col md={4}>
                                                    <Card.Img src={item.image} alt={item.label} style={{ width: '100%', height: '248px', objectFit: 'cover' }} />
                                                </Col>
                                                <Col md={8}>
                                                    <Card.Body style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between', 
                                                        height: '100%'
                                                    }}>
                                                        <div>
                                                            <h3 style={{ fontSize: "1.5rem", color: "#7FB237" }}>{item.label}</h3>
                                                            <ul className="list-unstyled">
                                                                <li><span style={{ fontWeight: "bold" }}>Cuisine:</span> {item.cuisineType}</li>
                                                                <li><span style={{ fontWeight: "bold" }}>Dish type:</span> {item.dishType}</li>
                                                                <li><span style={{ fontWeight: "bold" }}>Meal type:</span> {item.mealType}</li>
                                                            </ul>
                                                        </div>
                                                        <Button
                                                            className="remove-button"
                                                            style={{
                                                                border: "0px",
                                                                marginTop: "15px",
                                                                alignSelf: 'flex-end' 
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                handleRemove(item.uri);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon> 
                                                        </Button>
                                                    </Card.Body>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )
                    ))}
                </div>
            )}
        </>
    );
}