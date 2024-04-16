import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { Button, Row, Col } from 'react-bootstrap';
import { getToken } from '@/lib/authenticate';
import { addFavourite, getFavourites, removeFavourite } from '@/lib/favourite';
import { addHistory } from '@/lib/history';
import { updateMealPlan } from '@/lib/mealPlan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/recipe.module.css';
import Image from 'next/image'

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
        console.log(recipe)

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
  }, [uri, recipe]);

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
      console.log("Add", data)
    } else {
      const data = await removeFavourite(token, encodeURIComponent(uri))
      console.log("remove", data)
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
    <>
      {typeof recipe !== "undefined" && (
        <div className="recipe-page">
          <section className="recipe-content">
            <div className="recipe-image-wrapper">
              <Image src={recipe.image}  width="100" height="200" alt="recipe" style={{ height: "380px", width: "380px" }}  className="recipe-image" unoptimized/>
              <FontAwesomeIcon icon={isFavourited ? faHeart : farHeart} className="heart-icon" onClick={handleFavourites} style={{ color: "#7FB237" }} />
            </div>

            <div className="recipe-info">
              <h1 className="recipe-title">{recipe.label}</h1>
              <ul className="diet-tags">
                {recipe.digest.slice(0, 8).map((nutrient, index) => (
                  <li key={index} className="diet-tag pop-up-heading">{nutrient.label} &#x2022;  <span>{Math.round(nutrient.total)} {nutrient.unit}</span></li>
                ))}
              </ul>

            </div>
          </section>

          <ul className="ingredients-list">
            <h2 className="ingredients-title">Ingredients</h2>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item pop-up-heading">
                <div className="ingredient-image-wrapper">
                  <Image src={ingredient.image} width={0} height={0} alt="ingredient" className="ingredient-image" unoptimized/>
                </div>
                <span className="ingredient-text">{ingredient.text}</span>
              </li>
            ))}
          </ul>

          {!displayForm ? (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Button primary onClick={handleDisplayForm} className={styles["add-button"]}>Add to meal Plan</Button>
            </div>
          ) : (
            <div className={styles["form-container"]}>
              <div className={styles["add-form"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="dayOfWeek" className={styles["form-label"]}>Choose a day of the week:</label>
                  <select id="dayOfWeek" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} name="dayOfWeek" className={styles["form-select"]}>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="mealType" className={styles["form-label"]}>Choose a meal:</label>
                  <select id="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)} name="mealType" className={styles["form-select"]}>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>
              <div className={styles["button-group"]}>
                <Button primary onClick={handleCancel} className={styles["cancel-button"]}>Cancel</Button>
                <Button primary onClick={handleAdd} className={styles["add-button"]}>Add</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
