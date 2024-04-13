import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { getToken, isAuthenticated } from '@/lib/authenticate';
import { getMealPlan, removeMealPlan, clearMealPlan } from '@/lib/mealPlan';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [mealPlan, setMealPlan] = useState({})

    useEffect(() => {
        let fetchData = async () => {
            const token = getToken()
            const mealPlanData = await getMealPlan(token);
            setMealPlan(mealPlanData)
            console.log(mealPlanData)
        }

        fetchData()
    }, [])

    const handleAdd = () => {
        router.push("/search")
    }

    const handleReset = async () => {
        const token = getToken()
        await clearMealPlan(token)
        router.reload()
    }

    const handleView = (uri) => {
        router.push(`/recipes/${uri}`);
    }

    const handleRemove = async (uri, dayOfWeek, mealType) => {
        const token = getToken()
        await removeMealPlan(token, { uri, dayOfWeek, mealType })
        router.reload()
    }

    return (
        <>
            <h1>Your Meal Plan</h1>
            <Button primary onClick={handleAdd}>Add a meal</Button>
            <Button primary onClick={handleReset}>Reset</Button>
            <Row>
                <Col></Col>
                <Col>Breakfast</Col>
                <Col>Lunch</Col>
                <Col>Dinner</Col>
            </Row>
            {mealPlan?.length && mealPlan.map(dayMeal => (
                <Row>
                    <Col xs={1}>{dayMeal.day}</Col>
                    {dayMeal.meals.length && dayMeal.meals.map((meal, index) => (
                        <Col>
                            {meal.recipe.label.length > 0 ? (
                                <Card style={{ height: "200px", marginBottom: "20px" }}>
                                    <h5>{meal.recipe.label}</h5>
                                    <Row>
                                        <Col>
                                            <Card.Img variant="top" src={meal.recipe.image} style={{ maxWidth: '50%', height: 'auto' }} />
                                        </Col>
                                        <Col>
                                            <Card.Body>
                                                <bold><small>{meal.recipe.yield} servings</small></bold> <br />
                                                <bold>{Math.round(meal.recipe.calories / meal.recipe.yield)} kcal</bold>
                                                <Button variant="primary" onClick={() => handleView(meal.recipe.uri)}>View</Button>
                                                <Button variant="primary" onClick={() => handleRemove(meal.recipe.uri, dayMeal.day, meal.mealType)}>Remove</Button>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : (
                                <Card style={{ height: "200px", marginBottom: "20px" }}>

                                </Card>
                            )}
                        </Col>
                    ))}
                </Row>
            ))}


            <Row>
                {mealPlan?.length && mealPlan.map(dayMeal => (
                    <Col style={{ padding: "0px" }}>
                        <Row style={{ padding: "0px", width: "50%px", marginLeft: "8px" }}>{dayMeal.day}</Row>
                        {dayMeal.meals.length && dayMeal.meals.map((meal, index) => (
                            <Row style={{ padding: "0px", height: "180px", width: "180px", margin: "auto auto 60px 8px" }}>
                                <Card style={{ height: "180px", width: "180px", padding: "0px" }}>

                                    {meal.recipe.label.length > 0 && (
                                        <Card.Img variant="top" src={meal.recipe.image} style={{ height: "178px", width: "178px", margin: "0 0 0 0", borderRadius: "6px" }} />

                                    )}
                                </Card>
                                <Row>
                                    <Col xs={8} style={{ padding: "0px" }}>
                                        <small style={{ fontSize: "10px", padding: "0px", margin: "0px" }}>{meal.recipe.label}</small>
                                    </Col>
                                    <Col xs lg={3} style={{ padding: "0px" }}>
                                        <img src='/images/remove.png' style={{ padding: "0px", width: "40%" }} />
                                    </Col>
                                </Row>
                            </Row>
                        ))}
                    </Col>
                ))}
            </Row>
        </>
    );
}
