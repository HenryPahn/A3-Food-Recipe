import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { getToken, isAuthenticated } from '@/lib/authenticate';
import { getMealPlan, removeMealPlan, clearMealPlan } from '@/lib/mealPlan';
import { useRouter } from 'next/router';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

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
    }, [mealPlan])

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
    }

    return (
        <>
            {mealPlan?.length && mealPlan.map(dayMeal => (
                <Row>
                    <Col xs={1} style={{ borderBottom: "1px solid black", padding: "0px", height: "30px", fontWeight: "bold" }}>{dayMeal.day}</Col>
                    {dayMeal.meals.length && dayMeal.meals.map((meal, index) => (
                        <Col>
                            {meal.recipe.label.length > 0 ? (
                                <Card 
                                className="pop-up-heading" 
                                style={{ 
                                    height: "200px", 
                                    width: "370px", 
                                    marginBottom: "20px", 
                                    padding: "15px", 
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)" 
                                }} 
                                onClick={() => handleView(meal.recipe.uri)}
                            >
                                <h6 style={{ fontWeight: "bold", color: "#7FB237" }}>{meal.recipe.label}</h6>
                                <Row>
                                    <Col xs={4} style={{ padding: "0", margin: "auto 10px" }}>
                                        <Card.Img variant="top" src={meal.recipe.image} style={{ width: "140px", height: "140px", borderRadius: "5px" }} />
                                    </Col>
                                    <Col>
                                        <Card.Body style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            justifyContent: 'space-between', 
                                            height: '100%', 
                                            padding: "10px" 
                                        }}>
                                            <div>
                                                <em>{meal.recipe.yield} servings</em> <br />
                                                <em style={{ fontSize: "30px", textAlign: "center" }}>{Math.round(meal.recipe.calories / meal.recipe.yield)} kcal</em>
                                            </div>
                                            <Button 
                                                className="remove-button" 
                                                style={{  
                                                    border: "0px", 
                                                    alignSelf: 'flex-end' 
                                                }} 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleRemove(meal.recipe.uri, dayMeal.day, meal.mealType);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                            </Button>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                            ) : (
                                <Card className="pop-up-heading" style={{ height: "200px", width: "370px", marginBottom: "20px", padding: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={handleAdd}>
                                    <FontAwesomeIcon icon={faPlus}  style={{ color: "CCD3CA" }} size="2xl"></FontAwesomeIcon>
                                </Card>
                            )}
                        </Col>
                    ))}
                </Row>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <Button primary onClick={handleReset} style={{ backgroundColor: "#DD5746", border: "0px" }}>Reset the plan</Button>
            </div>
        </>
    );
}
