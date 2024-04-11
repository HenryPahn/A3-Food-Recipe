import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getToken, isAuthenticated, removeToken } from '@/lib/authenticate';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { getMealPlan, updateMealPlan } from '@/lib/mealPlan';

export default function MealSelectionForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [mealType, setMealType] = useState('Breakfast');
    const [recipe, setReceipe] = useState({})

    const router = useRouter();
    const { uri } = router.query;

    useEffect(() => {
        let fetchData = async () => {
            const app_id = process.env.APP_ID
            const app_key = process.env.APP_KEY
            const res = await fetch(`https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodeURIComponent(uri)}&app_id=${app_id}&app_key=${app_key}&field=mealType&field=dishType&field=image&field=label&field=healthLabels&field=yield&field=calories&field=digest&field=cuisineType&field=ingredients&field=uri`);
            const data = await res.json()
            setReceipe(data.hits[0].recipe)
            console.log(data.hits[0].recipe)
        }

        if(typeof uri === "undefined") 
        router.back()

        if (!isAuthenticated()) {
            router.push('/login')
        }

    
        fetchData()
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        
        const saveMealPlan = async () => {
            const token = getToken()
            
            const meal = {
                dayOfWeek: dayOfWeek,
                mealType: mealType,
                title: title, 
                description: description, 
                recipe: {
                    image: recipe.image,
                    label: recipe.label,
                    yield: recipe.yield,
                    calories: recipe.calories
                }
            }
            await updateMealPlan(token, meal)
        }

        saveMealPlan()
        router.push("/mealPlan")
    };

    return (
        <>
            <h1>Add meal</h1>
            <form>
                <Card className="mx-auto my-3" style={{ width: '50%' }}>
                    <Row className="g-0">
                        <Col md={4}>
                            <Card.Img src={recipe.image} alt={recipe.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Col>
                        <Col md={8}>
                            <Card.Body>
                                <Card.Title><h3>{recipe.label}</h3></Card.Title>
                                <Card.Text>
                                    <ul className="list-unstyled">
                                        <li>Cuisine: {recipe.cuisineType}</li>
                                        <li>Dish type: {recipe.dishType}</li>
                                        <li>Meal: {recipe.mealType}</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>

                <label for="title">Title:</label><br />
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} id="title" name="title" /><br />

                <label for="description">Description:</label><br />
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} name="description" rows="4" cols="50"></textarea><br />

                <label for="dayOfWeek">Choose a day of the week:</label>
                <select id="dayOfWeek" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} name="dayOfWeek">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select><br />

                <label for="mealType">Choose a meal:</label>
                <select id="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)} name="mealType">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select><br />

                <Button variant="primary" onClick={handleSubmit}>Add</Button>
            </form>
        </>
    );
}
