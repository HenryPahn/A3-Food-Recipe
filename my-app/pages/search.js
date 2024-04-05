import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar'

export default function SearchRecipe() {
  const [recipes, setReceipes] = useState([])
  const router = useRouter();

  const onSearch = async (search_query) => {
    console.log("query: ", search_query)
    const app_id = process.env.APP_ID
    const app_key = process.env.APP_KEY
    const res = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${search_query}&app_id=${app_id}&app_key=${app_key}`);
    const data = await res.json()
    console.log(data.hits[0])
    setReceipes(data.hits)
  }

  return (
    <>
      <SearchBar onSearch={onSearch}/>
      {recipes.length > 0 && recipes.map((attribute, index) => (
        <div className="card" style={{ width: '18rem' }}>
          <img src={attribute.recipe.image} className="card-img-top" alt="Pizza Dough" />
          <div className="card-body">
            <h5 className="card-title">{attribute.recipe.label}</h5>
            {/* <h6 className="card-subtitle mb-2 text-muted">{nutrition.servings} servings | {nutrition.kcal} kcal</h6> */}
            <div className="mb-2">
              {attribute.recipe.healthLabels.map((label, index) => (
                <span key={index} className="badge bg-secondary me-1">{label}</span>
              ))}
            </div>
            <ul className="list-group list-group-flush">
              {attribute.recipe.digest.map((nutrition, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {nutrition.label}
                  <span className="badge bg-primary rounded-pill">{Math.round(nutrition.total)} {nutrition.unit}</span>
                </li>
              ))}
            </ul> 
          </div>
        </div>
      ))}
    </>
  );
}

// name: data[i].recipe.label
// tags: data[i].recipe.healthLabels
// image: data[i].recipe.image
// fat: data[i].recipe.digest[0].label
// amount: data[i].recipe.digest[0].total
// unit: data[i].recipe.digest[0].unit
// carb: data[i].recipe.digest[1].label
// protein: data[i].recipe.digest[2].label
// Cholesterol: data[i].recipe.digest[3].label
// sodium: data[i].recipe.digest[4].label
// calcium: data[i].recipe.digest[5].label
// Magnesium: data[i].recipe.digest[6].label
// Potassium: data[i].recipe.digest[7].label
// Iron: data[i].recipe.digest[8].label
