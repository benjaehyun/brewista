import React, {useEffect, useState} from 'react'
import { fetchCurrentUserRecipes } from '../../utilities/recipe-api'
import RecipeCard from '../../components/RecipeIndex/RecipeCard'

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const userRecipes = await fetchCurrentUserRecipes()
        setRecipes(userRecipes)
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
      }
    }
    fetchRecipes()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">My Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
        </div>
    </div>
  );
}
