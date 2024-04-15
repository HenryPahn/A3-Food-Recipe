import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar'

export default function SearchRecipe() {
  const router = useRouter();
  const [recipes, setReceipes] = useState([])
  const { q } = router.query

  useEffect(() => {
    const getRecipes = async () => {
      const app_id = process.env.APP_ID
      const app_key = process.env.APP_KEY
      const res = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${q}&app_id=${app_id}&app_key=${app_key}&field=mealType&field=dishType&field=image&field=label&field=healthLabels&field=yield&field=calories&field=digest&field=cuisineType&field=ingredients&field=uri`);
      const data = await res.json()
      console.log(data)
      setReceipes(data.hits)
    }

    getRecipes()
  }, [q]);

  const handleView = (uri) => {
    router.push(`/recipes/${encodeURIComponent(uri)}`);
  }

  return (
    <>
      <div className="card-container">
        {recipes?.length > 0 ? recipes.map((attribute, index) => (
          <div className="card pop-up-heading" style={{ width: '18rem' }} onClick={() => handleView(attribute.recipe.uri)}>
            <div className='card-header' style={{ padding: "0px" }}>
              <div>
                <img src={attribute.recipe.image} className="card-img-top" alt={attribute.recipe.label} style={{ width: "286px", height: "286px" }} />
              </div>
            </div>
            <div className="card-body">
              <h3 className="card-title">{attribute.recipe.label}</h3>
              <div>
                {attribute.recipe.healthLabels.map((label, index) => (
                  <span key={index} className="badge bg-secondary me-1">{label}</span>
                ))}
              </div>
            </div>
          </div>
        )) : (
          <p>Not found</p>
        )}
      </div>
    </>
  );
}

{/* <div className="card" style={{ width: '18rem' }}>
          <div className='card-header'>
            <div>
              <h3 className="card-title">{attribute.recipe.label}</h3>
              <img src={attribute.recipe.image} className="card-img-top" alt={attribute.recipe.label} />
            </div>
          </div>
          <div className="card-body">
            <div>
              {attribute.recipe.healthLabels.map((label, index) => (
                <span key={index} className="badge bg-secondary me-1">{label}</span>
              ))}
            </div>
            <div>
              <h6>{attribute.recipe.yield} servings</h6>
              <h4>{Math.round(attribute.recipe.calories / attribute.recipe.yield)} <span style={{ fontSize: "70%" }}>kcal</span></h4>
            </div>
            <div>
              <ul>
                <li>{attribute.recipe.digest[2].label.toUpperCase()} {Math.round(attribute.recipe.digest[2].total)} {attribute.recipe.digest[2].unit}</li>
                <li>{attribute.recipe.digest[0].label.toUpperCase()} {Math.round(attribute.recipe.digest[0].total)} {attribute.recipe.digest[0].unit}</li>
                <li>{attribute.recipe.digest[1].label.toUpperCase()} {Math.round(attribute.recipe.digest[1].total)} {attribute.recipe.digest[1].unit}</li>
              </ul>
            </div>
            <div>
              <ul style={{ listStyleType: "none" }}>
                <li>{attribute.recipe.digest[3].label} {Math.round(attribute.recipe.digest[3].total)} {attribute.recipe.digest[3].unit}</li>
                <li>{attribute.recipe.digest[4].label} {Math.round(attribute.recipe.digest[4].total)} {attribute.recipe.digest[4].unit}</li>
                <li>{attribute.recipe.digest[5].label} {Math.round(attribute.recipe.digest[5].total)} {attribute.recipe.digest[5].unit}</li>
                <li>{attribute.recipe.digest[6].label} {Math.round(attribute.recipe.digest[6].total)} {attribute.recipe.digest[6].unit}</li>
                <li>{attribute.recipe.digest[7].label} {Math.round(attribute.recipe.digest[7].total)} {attribute.recipe.digest[7].unit}</li>
                <li>{attribute.recipe.digest[8].label} {Math.round(attribute.recipe.digest[8].total)} {attribute.recipe.digest[8].unit}</li>
              </ul>
            </div>
            <Button variant="primary" onClick={() => handleView(attribute.recipe.uri)}>View Recipe</Button>
          </div>
        </div> */}