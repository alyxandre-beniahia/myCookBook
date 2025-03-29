import api from './api';

// Recipe endpoints
export const getAllRecipes = async () => {
  const response = await api.get('/recipes');
  return response.data;
};

export const getRecipeById = async (id) => {
    try {
      console.log(`Fetching recipe with ID: ${id}`);
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error details:', error.response?.data);
      throw error;
    }
  };
  

export const searchRecipes = async (params) => {
  const response = await api.get('/recipes/search', { params });
  return response.data;
};

export const createRecipe = async (recipeData) => {
  // Handle file upload with FormData
  const formData = new FormData();
  
  // Add recipe data
  formData.append('title', recipeData.title);
  formData.append('description', recipeData.description || '');
  formData.append('category', recipeData.category);
  
  // Add arrays as JSON strings
  formData.append('ingredients', JSON.stringify(recipeData.ingredients));
  formData.append('steps', JSON.stringify(recipeData.steps));
  
  // Add image if exists
  if (recipeData.image) {
    formData.append('image', recipeData.image);
  }
  
  const response = await api.post('/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  // Handle file upload with FormData if there's an image
  if (recipeData.image) {
    const formData = new FormData();
    
    // Add recipe data
    formData.append('title', recipeData.title);
    formData.append('description', recipeData.description || '');
    formData.append('category', recipeData.category);
    
    // Add arrays as JSON strings
    formData.append('ingredients', JSON.stringify(recipeData.ingredients));
    formData.append('steps', JSON.stringify(recipeData.steps));
    
    // Add image
    formData.append('image', recipeData.image);
    
    const response = await api.patch(`/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } else {
    // Regular JSON request without image
    const response = await api.patch(`/recipes/${id}`, recipeData);
    return response.data;
  }
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

export const rateRecipe = async (id, value) => {
  const response = await api.post(`/recipes/${id}/ratings`, { value });
  return response.data;
};

export const getRecipeRating = async (id) => {
  const response = await api.get(`/recipes/${id}/ratings`);
  return response.data;
};

// Comment endpoints
export const getRecipeComments = async (recipeId) => {
  const response = await api.get(`/recipes/${recipeId}/comments`);
  return response.data;
};

export const createComment = async (recipeId, content) => {
  const response = await api.post(`/recipes/${recipeId}/comments`, { content });
  return response.data;
};

export const deleteComment = async (recipeId, commentId) => {
  const response = await api.delete(`/recipes/${recipeId}/comments/${commentId}`);
  return response.data;
};

// Favorite endpoints
export const getFavorites = async () => {
    try {
      const response = await api.get('/users/favorites');
      console.log('Favorites response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  };
  


export const addToFavorites = async (recipeId) => {
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }
    
    // Validate the ID format before sending
    if (!/^[0-9a-fA-F]{24}$/.test(recipeId)) {
      throw new Error('Invalid recipe ID format');
    }
    
    // Use /users/favorites/:id instead of /users/favorites/:recipeId
    const response = await api.patch(`/users/favorites/${recipeId}`);
    return response.data;
};

export const removeFromFavorites = async (recipeId) => {
    if (!recipeId) {
        throw new Error('Recipe ID is required');
    }
    
    // Validate the ID format before sending
    if (!/^[0-9a-fA-F]{24}$/.test(recipeId)) {
      throw new Error('Invalid recipe ID format');
    }
    
    // Use /users/favorites/:id instead of /users/favorites/:recipeId
    const response = await api.delete(`/users/favorites/${recipeId}`);
    return response.data;
};



