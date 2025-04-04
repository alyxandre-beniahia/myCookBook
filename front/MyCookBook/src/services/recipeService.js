import api from "./api";

// Recipe endpoints
export const getAllRecipes = async () => {
  const response = await api.get("/recipes");
  return response.data;
};

export const getRecipeById = async (id) => {
  try {
    console.log(`Fetching recipe with ID: ${id}`);
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error details:", error.response?.data);
    throw error;
  }
};

export const searchRecipes = async (params) => {
  const response = await api.get("/recipes/search", { params });
  return response.data;
};

export const createRecipe = async (recipeData) => {
  // Create a FormData object
  const formData = new FormData();

  // Add basic fields - ensure they're not undefined
  formData.append("title", recipeData.title || "");
  formData.append("description", recipeData.description || "");
  formData.append("category", recipeData.category || "");

  // Handle arrays properly - stringify them first
  formData.append("ingredients", JSON.stringify(recipeData.ingredients || []));
  formData.append("steps", JSON.stringify(recipeData.steps || []));

  // Add image if it exists
  if (recipeData.image) {
    formData.append("image", recipeData.image);
  }

  // Log what we're sending for debugging
  console.log("Sending recipe data:", {
    title: recipeData.title,
    description: recipeData.description,
    category: recipeData.category,
    ingredients: recipeData.ingredients,
    steps: recipeData.steps,
    hasImage: !!recipeData.image,
  });

  try {
    const response = await api.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error details:", error.response?.data);
    console.error("Full errors array:", error.response?.data?.errors);
    throw error;
  }
};

export const updateRecipe = async (id, recipeData) => {
  const token = localStorage.getItem("token");

  // Always use FormData for consistency
  const formData = new FormData();

  // Add basic fields
  formData.append("title", recipeData.title);
  formData.append("description", recipeData.description || "");
  formData.append("category", recipeData.category);

  // Add arrays as JSON strings
  formData.append("ingredients", JSON.stringify(recipeData.ingredients));
  formData.append("steps", JSON.stringify(recipeData.steps));

  // Add image if it exists
  if (recipeData.image) {
    formData.append("image", recipeData.image);
  }

  const response = await api.patch(`/recipes/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

// Add a simple cache for ratings
// Keep this outside the function to persist between calls
const ratingsCache = new Map();

export const getRecipeRating = async (id) => {
  try {
    // Check cache first
    if (ratingsCache.has(id)) {
      const { data, timestamp } = ratingsCache.get(id);
      // Cache valid for 5 minutes
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        console.log(`Using cached rating for recipe ${id}`);
        return data;
      }
      // Cache expired, will fetch fresh data
      console.log(`Cache expired for recipe ${id}, fetching fresh data`);
    }

    console.log(`Fetching rating for recipe ${id} from API`);
    const response = await api.get(`/recipes/${id}/ratings`);

    // Store in cache
    ratingsCache.set(id, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching rating for recipe ${id}:`, error);

    // If we have cached data, even if expired, use it as a fallback
    if (ratingsCache.has(id)) {
      console.log(`Using expired cache as fallback for recipe ${id}`);
      return ratingsCache.get(id).data;
    }

    // Re-throw the error so the component can handle it
    throw error;
  }
};

export const rateRecipe = async (id, value) => {
  try {
    console.log(`Submitting rating ${value} for recipe ${id}`);
    const response = await api.post(`/recipes/${id}/ratings`, { value });

    // Invalidate the cache for this recipe
    ratingsCache.delete(id);

    return response.data;
  } catch (error) {
    console.error(`Error rating recipe ${id}:`, error);
    throw error;
  }
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
  const response = await api.delete(
    `/recipes/${recipeId}/comments/${commentId}`
  );
  return response.data;
};

// Favorite endpoints
export const getFavorites = async () => {
  try {
    const response = await api.get("/users/favorites");
    console.log("Favorites response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const addToFavorites = async (recipeId) => {
  if (!recipeId) {
    throw new Error("Recipe ID is required");
  }

  // Validate the ID format before sending
  if (!/^[0-9a-fA-F]{24}$/.test(recipeId)) {
    throw new Error("Invalid recipe ID format");
  }

  // Use /users/favorites/:id instead of /users/favorites/:recipeId
  const response = await api.patch(`/users/favorites/${recipeId}`);
  return response.data;
};

export const removeFromFavorites = async (recipeId) => {
  if (!recipeId) {
    throw new Error("Recipe ID is required");
  }

  // Validate the ID format before sending
  if (!/^[0-9a-fA-F]{24}$/.test(recipeId)) {
    throw new Error("Invalid recipe ID format");
  }

  // Use /users/favorites/:id instead of /users/favorites/:recipeId
  const response = await api.delete(`/users/favorites/${recipeId}`);
  return response.data;
};
