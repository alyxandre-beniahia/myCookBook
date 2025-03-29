import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchRecipes } from '../../services/recipeService';
import RecipeList from './RecipeList';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const RecipeSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const initialQuery = searchParams.get('query') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (searchQuery) params.query = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        
        const data = await searchRecipes(params);
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = {};
    if (searchQuery) params.query = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleFavoriteToggle = (recipeId, isFavorite) => {
    if (isFavorite) {
      setFavorites(prev => [...prev, recipeId]);
    } else {
      setFavorites(prev => prev.filter(id => id !== recipeId));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Recipes</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or ingredients"
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Filter by category:</p>
          <div className="flex flex-wrap gap-2">
            {['entrée', 'plat', 'dessert'].map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {recipes.length > 0 
              ? `Found ${recipes.length} recipe${recipes.length === 1 ? '' : 's'}`
              : 'No recipes found'}
          </h2>
          <RecipeList 
            recipes={recipes} 
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </>
      )}
    </div>
  );
};

export default RecipeSearch;
