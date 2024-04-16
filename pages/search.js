import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'

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
          <div className="card pop-up-heading" style={{ width: '18rem' }} onClick={() => handleView(attribute.recipe.uri)} key={index}>
            <div className='card-header' style={{ padding: "0px" }}>
              <div>
                <Image src={attribute.recipe.image} className="card-img-top" width={286} height={286} alt={attribute.recipe.label} />
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
          <p>Recipe of {q} is not found</p>
        )}
      </div>
    </>
  );
}
