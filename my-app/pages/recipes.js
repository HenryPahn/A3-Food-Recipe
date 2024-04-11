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

    const getRecipe = async () => {
      const app_id = process.env.APP_ID
      const app_key = process.env.APP_KEY
      const res = await fetch(`https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodeURIComponent(uri)}&app_id=${app_id}&app_key=${app_key}&field=mealType&field=dishType&field=image&field=label&field=healthLabels&field=yield&field=calories&field=digest&field=cuisineType&field=ingredients&field=uri`);
      const data = await res.json()
      if (data.hits?.length){
        setRecipe(data.hits[0].recipe)

        let newHistory = {
          cuisineType: data.hits[0].recipe.cuisineType[0],
          dishType: data.hits[0].recipe.dishType[0],
          mealType: data.hits[0].recipe.mealType[0],
          image: data.hits[0].recipe.image,
          label: data.hits[0].recipe.label,
          uri: encodeURIComponent(data.hits[0].recipe.uri)
        }
        let token = getToken()

        await addHistory(token, newHistory)
      }
      else
        router.back()
    }

    const checkFound = async () => {
      let token = getToken()
      const favourites = await getFavourites(token)

      let currentlyFound = false;

      for (let favourite of favourites) {
        if (encodeURIComponent(uri) === favourite.uri) {
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

    getRecipe()
    checkFound()
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleFavourites = async () => {
    setIsAdded(!isAdded);
    let token = getToken()
    const favourites = await getFavourites(token)

    let currentlyFound = false;

    for (let favourite of favourites) {
      if (encodeURIComponent(uri) === favourite.uri) {
        currentlyFound = true;
        break;
      }
    }

    if (!currentlyFound) {
      let newFavourite = {
        cuisineType: recipe.cuisineType[0],
        dishType: recipe.dishType[0],
        mealType: recipe.mealType[0],
        image: recipe.image,
        label: recipe.label,
        uri: encodeURIComponent(recipe.uri)
      }

      const data = await addFavourite(token, newFavourite)
      console.log(data)
    } else {
      const data = await removeFavourite(token, uri)
      console.log(data)
    }
  }

  const handleAdd = () => {
    router.push(`/mealPlan/add?uri=${encodeURIComponent(uri)}`)
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
              {isAdded ? 'Remove' : 'Add To Favourite'}
            </Button>
            <Button variant="primary" onClick={handleAdd}>Add to recipe</Button>
          </div>
        </div>
      )}
    </div>
  );
}
