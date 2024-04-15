import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { getToken } from '@/lib/authenticate';
import { addFavourite, getFavourites, removeFavourite } from '@/lib/favourite';
import { addHistory } from '@/lib/history';
import { updateMealPlan } from '@/lib/mealPlan';

export default function Recipes() {
  const router = useRouter()
  const { uri } = router.query

  const [recipe, setRecipe] = useState(undefined)
  const [isFavourited, setIsFavourited] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [mealType, setMealType] = useState('Breakfast');


  useEffect(() => {
    const getRecipe = async () => {
      const app_id = process.env.APP_ID
      const app_key = process.env.APP_KEY
      const res = await fetch(`https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodeURIComponent(uri)}&app_id=${app_id}&app_key=${app_key}&field=mealType&field=dishType&field=image&field=label&field=healthLabels&field=yield&field=calories&field=digest&field=cuisineType&field=ingredients&field=uri`);
      const data = await res.json()
      if (data.hits?.length) {
        setRecipe(data.hits[0].recipe)
        console.log(data.hits[0].recipe)

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
      setIsFavourited(currentlyFound)
    }

    getRecipe()
    checkFound()
  }, [uri]);

  const handleGoBack = () => {
    router.back();
  };

  const handleFavourites = async () => {
    setIsFavourited(!isFavourited);
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

  const handleDisplayForm = () => {
    setDisplayForm(!displayForm)
  }

  const handleCancel = () => {
    setDisplayForm(!displayForm)
  }

  const handleAdd = (e) => {
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
          calories: recipe.calories,
          uri: encodeURIComponent(uri)
        }
      }
      await updateMealPlan(token, meal)
    }

    saveMealPlan()
    router.push("/mealPlan")
  }

  return (
    // <div>
    //   <h1>{recipe.label}</h1>
    //   {typeof recipe !== "undefined" && (
    //     <div>
    //       <div>
    //         <img src={recipe.image} alt={recipe.label} style={{ maxWidth: '100%', height: 'auto' }} />
    //       </div>
    //       <div>

    //         <ul>
    //           {recipe.ingredients.map((ingredient, index) => (
    //             <li key={index}>{ingredient.text}</li>
    //           ))}
    //         </ul>
    //         {!displayForm ? (
    //           <>
    //             <Button variant="primary" onClick={handleGoBack}>Go back</Button>
    //             <Button variant="primary" onClick={handleFavourites}>
    //               {isFavourited ? 'Remove' : 'Add To Favourite'}
    //             </Button>
    //             <Button variant="primary" onClick={handleDisplayForm}>Add to recipe</Button>
    //           </>
    //         ) : (
    //           <>
    //             <h1>Add recipe to meal plan</h1>

    //             <label for="dayOfWeek">Choose a day of the week:</label>
    //             <select id="dayOfWeek" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} name="dayOfWeek">
    //               <option value="Monday">Monday</option>
    //               <option value="Tuesday">Tuesday</option>
    //               <option value="Wednesday">Wednesday</option>
    //               <option value="Thursday">Thursday</option>
    //               <option value="Friday">Friday</option>
    //               <option value="Saturday">Saturday</option>
    //               <option value="Sunday">Sunday</option>
    //             </select><br />

    //             <label for="mealType">Choose a meal:</label>
    //             <select id="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)} name="mealType">
    //               <option value="Breakfast">Breakfast</option>
    //               <option value="Lunch">Lunch</option>
    //               <option value="Dinner">Dinner</option>
    //             </select><br />

    //             <Button variant="primary" onClick={handleCancel}>Cancel</Button>
    //             <Button variant="primary" onClick={handleAdd}>Add</Button>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="recipe-page">
      <section className="recipe-content">
        <div className="recipe-image-wrapper">
          <img src={recipe.image} alt={`Image of ${recipe.label}`} className="recipe-image" />
        </div>


        <div className="recipe-info">
          <h1 className="recipe-title">{recipe.label}</h1>
          <ul className="diet-tags">
            {recipe.healthLabels.map((label, index) => (
              <li key={index} className="diet-tag">{label}</li>
            ))}
          </ul>
        </div>
      </section>
      <div>
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
              <img src={ingredient.image} alt={ingredient.food} className="ingredient-image" />
              <span>{ingredient.text}</span>
            </li>
          ))}
        </ul>

        <h2>Nutritional Information</h2>
        <div className="nutrition-info">
          <p><strong>Calories:</strong> {Math.round(recipe.calories)} kcal</p>
          {/* Map through each nutrient for display */}
        </div>



        <button className="view-recipe-btn" onClick={() => window.open(recipe.uri)}>View Full Recipe</button>
      </div>
    </div>
  );
}
