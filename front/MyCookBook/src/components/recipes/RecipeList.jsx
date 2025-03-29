import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, favorites, onFavoriteToggle }) => {
  // Add a check to ensure recipes is an array before mapping
  if (!recipes || !Array.isArray(recipes)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recipes available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard 
            key={recipe._id || `recipe-${index}`}
            recipe={recipe}
            isFavorite={favorites?.includes(recipe._id)}
            onFavoriteToggle={onFavoriteToggle}
        />
    ))}
    </div>
  );
};

export default RecipeList;
