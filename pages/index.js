import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { readToken } from "@/lib/authenticate";

export default function Home() {
  const [token, setToken] = useState(undefined);
  useEffect(() => {
    setToken(readToken());
  }, []);

  return (
    <>
      <div className={styles.container}>
        {/* Title Section */}
        <h1 className={styles.title}>
          Welcome to Food Recipe
          {typeof token !== "undefined" && (",  " + token.userName)}
          ! <span>🍽️</span>
        </h1>
        <p className={styles.subtitle}>
          Discover delicious recipes, explore ingredients, and check nutrition
          facts to make informed meal choices!
        </p>

        {/* How to Use Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>💡 How to Use</h2>
          <ul className={styles.list}>
            <li>
              <span>🔍</span> <b>Search for recipes</b>using the search bar
              above.
            </li>
            <li>
              <span>🍎</span> <b> See Ingredients</b> and their nutritional
              benefits.
            </li>
            <li>
              <span>📅</span> <b>Add recipes to your meal plan</b> for easy
              organization.
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <p className={styles.footer}>
        Start by typing a recipe name!  Log in to save favorites, plan meals, and see history.
        </p>
      </div>
    </>
  );
}
