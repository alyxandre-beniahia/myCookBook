import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import Masonry from "../layout/Masonry";

const RecipeList = ({ recipes, favorites = [], onFavoriteToggle }) => {
  const [key, setKey] = useState(0);

  // Force re-render when recipes change
  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
    console.log("RecipeList: Recipes changed, new count:", recipes?.length);
  }, [recipes]);

  // Add a check to ensure recipes is an array before mapping
  if (!recipes || !Array.isArray(recipes)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recipes available</p>
      </div>
    );
  }

  // Log recipe structure for debugging
  useEffect(() => {
    if (recipes.length > 0) {
      console.log("Recipe list data:", {
        firstRecipe: recipes[0],
        imageType: typeof recipes[0].image,
        totalRecipes: recipes.length,
        favoritesCount: favorites?.length || 0,
      });
    }
  }, [recipes, favorites]);

  // Check if a recipe is in favorites
  const isRecipeFavorite = (recipeId) => {
    return (
      Array.isArray(favorites) &&
      favorites.some((fav) => fav._id === recipeId || fav === recipeId)
    );
  };

  // Prepare recipe items with consistent heights
  const recipeItems = recipes.map((recipe, index) => {
    const isFav = isRecipeFavorite(recipe._id);
    console.log(`Recipe ${recipe._id || index}: isFavorite=${isFav}`);

    return (
      <RecipeCard
        key={recipe._id || `recipe-${index}`}
        recipe={recipe}
        isFavorite={isFav}
        onFavoriteToggle={onFavoriteToggle}
        id={recipe._id || `recipe-${index}`}
        height={350} // Fixed height for all cards
        className="w-full h-full transition-all duration-300 hover:shadow-lg"
      />
    );
  });

  return (
    <div className="w-full px-4" key={key}>
      <Masonry itemHeight={350} gap={20}>
        {recipeItems}
      </Masonry>
    </div>
  );
};

export default RecipeList;
