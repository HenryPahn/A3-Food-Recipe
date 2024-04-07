import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { getToken, isAuthenticated, removeToken } from '@/lib/authenticate';
import { addFavourite, getFavourites, removeFavourite } from '@/lib/favourite';
import { addHistory, getHistory, removeHistory } from '@/lib/history';
import { Card, Button, Row, Col } from 'react-bootstrap';



export default function Recipes() {
  const router = useRouter();
  const { uri } = router.query;
  const [recipe, setRecipe] = useState(undefined)
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const addToHistory = async () => {
      let token = getToken()
      const data = await addHistory(token, encodeURIComponent(uri))
      console.log("History: ", data)
    }

    const getRecipe = async () => {
      const app_id = process.env.APP_ID
      const app_key = process.env.APP_KEY
      const res = await fetch(`https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodeURIComponent(uri)}&app_id=${app_id}&app_key=${app_key}&field=mealType&field=dishType&field=image&field=label&field=healthLabels&field=yield&field=calories&field=digest&field=cuisineType&field=ingredients&field=uri`);
      const data = await res.json()
      setRecipe(data.hits[0].recipe)
    }

    const checkFound = async () => {
      let token = getToken()
      const uri_data = await getFavourites(token)

      let currentlyFound = false;

      for (let i of uri_data) {
        if (encodeURIComponent(uri) === i) {
          currentlyFound = true;
          break;
        }
      }
      setIsAdded(currentlyFound)
    }

    if (!isAuthenticated()) {
      router.push('/login')
    }

    if (typeof uri === "undefined") {
      router.back()
    }

    addToHistory()
    getRecipe()
    checkFound()
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleFavourites = async () => {
    setIsAdded(!isAdded);
    let token = getToken()
    const uri_data = await getFavourites(token)

    let currentlyFound = false;

    for (let i of uri_data) {
      if (encodeURIComponent(uri) === i) {
        currentlyFound = true;
        break;
      }
    }

    if (!currentlyFound) {
      const data = await addFavourite(token, encodeURIComponent(uri))
      console.log(data)
    } else {
      const data = await removeFavourite(token, encodeURIComponent(uri))
      console.log(data)
    }
  }

  return (
    <div>
      <h1>Meal Detail</h1>
      {typeof recipe !== "undefined" && (
        <div>
          <div>
            <img src={recipe.image} alt={recipe.label} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          <div>
            <h1>{recipe.label}</h1>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.text}</li>
              ))}
            </ul>
            <Button variant="primary" onClick={handleGoBack}>Go back</Button>
            <Button variant="primary" onClick={handleFavourites}>
              {isAdded ? 'Added' : 'Add'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
