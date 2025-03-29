import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe, updateRecipe, getRecipeById } from '../../services/recipeService';

const RecipeForm = ({ recipeId }) => {
  const isEditing = !!recipeId;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    category: 'plat',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const recipe = await getRecipeById(recipeId);
          
          setFormData({
            title: recipe.title || '',
            description: recipe.description || '',
            ingredients: recipe.ingredients || [''],
            steps: recipe.steps || [''],
            category: recipe.category || 'plat',
            image: null // We don't load the image for editing
          });
          
          if (recipe.image?.url) {
            setImagePreview(recipe.image.url);
          }
          
          setError(null);
        } catch (err) {
          setError('Failed to load recipe');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecipe();
  }, [recipeId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = [...formData.ingredients];
      newIngredients.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = [...formData.steps];
      newSteps.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        steps: newSteps
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const nonEmptyIngredients = formData.ingredients.filter(i => i.trim());
    const nonEmptySteps = formData.steps.filter(s => s.trim());
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (nonEmptyIngredients.length === 0) {
      setError('At least one ingredient is required');
      return;
    }
    
    if (nonEmptySteps.length === 0) {
      setError('At least one step is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Clean up empty ingredients and steps
      const cleanedFormData = {
        ...formData,
        ingredients: nonEmptyIngredients,
        steps: nonEmptySteps
      };
      
      let response;
      if (isEditing) {
        response = await updateRecipe(recipeId, cleanedFormData);
      } else {
        response = await createRecipe(cleanedFormData);
      }
      
      navigate(`/recipes/${response.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input"
            placeholder="Recipe title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Describe your recipe"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="entrée">Entrée</option>
            <option value="plat">Plat</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients *
          </label>
          <div className="space-y-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="input flex-grow"
                  placeholder={`Ingredient ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length <= 1}
                  className={`btn ${formData.ingredients.length <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn btn-secondary"
            >
              Add Ingredient
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Steps *
          </label>
          <div className="space-y-2">
            {formData.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="pt-2 text-gray-500 font-medium min-w-[24px]">
                  {index + 1}.
                </div>
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="input flex-grow min-h-[80px]"
                  placeholder={`Step ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={formData.steps.length <= 1}
                  className={`btn ${formData.steps.length <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="btn btn-secondary"
            >
              Add Step
              </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="btn btn-secondary cursor-pointer"
            >
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </label>
            
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image: null }));
                }}
                className="btn bg-red-100 text-red-600 hover:bg-red-200"
              >
                Remove Image
              </button>
            )}
          </div>
          
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-auto object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`btn btn-primary ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;