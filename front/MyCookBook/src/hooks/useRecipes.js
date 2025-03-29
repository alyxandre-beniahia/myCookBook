import { useState, useEffect } from 'react';
import { getAllRecipes, searchRecipes } from '../services/recipeService';

export const useRecipes = (initialQuery = '', initialCategory = '') => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let data;
        
        if (query || category) {
          data = await searchRecipes(query, category);
        } else {
          data = await getAllRecipes();
        }
        
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [query, category]);

  return { recipes, loading, error, setQuery, setCategory };
};
