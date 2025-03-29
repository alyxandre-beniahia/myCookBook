# myCookBook API Documentation

## Base URL
All endpoints are prefixed with `/api`

## Authentication

### Register a new user
- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
  ```

### Login user
- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
  ```

## Recipes

### Get all recipes
- **URL**: `/recipes`
- **Method**: `GET`
- **Authentication**: None
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": "recipe_id",
      "title": "Recipe Title",
      "description": "Recipe Description",
      "ingredients": ["ingredient1", "ingredient2"],
      "steps": ["step1", "step2"],
      "category": "plat",
      "author": {
        "id": "user_id",
        "name": "Author Name"
      },
      "image": {
        "url": "image_url"
      },
      "createdAt": "date"
    }
  ]
  ```

### Search recipes
- **URL**: `/recipes/search`
- **Method**: `GET`
- **Authentication**: None
- **Query Parameters**:
  - `query` (optional): Search term for title or ingredients
  - `category` (optional): Filter by category ("entrée", "plat", "dessert")
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": "recipe_id",
      "title": "Recipe Title",
      "description": "Recipe Description",
      "ingredients": ["ingredient1", "ingredient2"],
      "steps": ["step1", "step2"],
      "category": "plat",
      "author": {
        "id": "user_id",
        "name": "Author Name"
      },
      "image": {
        "url": "image_url"
      },
      "createdAt": "date"
    }
  ]
  ```

### Get a specific recipe
- **URL**: `/recipes/:id`
- **Method**: `GET`
- **Authentication**: None
- **URL Parameters**: `id` - Recipe ID
- **Success Response**: `200 OK`
  ```json
  {
    "id": "recipe_id",
    "title": "Recipe Title",
    "description": "Recipe Description",
    "ingredients": ["ingredient1", "ingredient2"],
    "steps": ["step1", "step2"],
    "category": "plat",
    "author": {
      "id": "user_id",
      "name": "Author Name"
    },
    "image": {
      "url": "image_url"
    },
    "ratings": [
      {
        "user": {
          "id": "user_id",
          "name": "User Name"
        },
        "value": 5
      }
    ],
    "createdAt": "date"
  }
  ```

### Create a new recipe
- **URL**: `/recipes`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "Recipe Title",
    "description": "Recipe Description",
    "ingredients": ["ingredient1", "ingredient2"],
    "steps": ["step1", "step2"],
    "category": "plat"
  }
  ```
- **Request File**: `image` (optional) - Recipe image
- **Success Response**: `201 Created`
  ```json
  {
    "id": "recipe_id",
    "title": "Recipe Title",
    "description": "Recipe Description",
    "ingredients": ["ingredient1", "ingredient2"],
    "steps": ["step1", "step2"],
    "category": "plat",
    "author": "user_id",
    "image": {
      "public_id": "cloudinary_id",
      "url": "image_url"
    },
    "createdAt": "date"
  }
  ```

### Update a recipe
- **URL**: `/recipes/:id`
- **Method**: `PATCH`
- **Authentication**: Required (must be recipe author)
- **URL Parameters**: `id` - Recipe ID
- **Request Body** (all fields optional):
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "ingredients": ["updated ingredient1", "updated ingredient2"],
    "steps": ["updated step1", "updated step2"],
    "category": "dessert"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": "recipe_id",
    "title": "Updated Title",
    "description": "Updated Description",
    "ingredients": ["updated ingredient1", "updated ingredient2"],
    "steps": ["updated step1", "updated step2"],
    "category": "dessert",
    "author": "user_id",
    "image": {
      "url": "image_url"
    },
    "createdAt": "date"
  }
  ```

### Delete a recipe
- **URL**: `/recipes/:id`
- **Method**: `DELETE`
- **Authentication**: Required (must be recipe author)
- **URL Parameters**: `id` - Recipe ID
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Recette supprimée avec succès"
  }
  ```

### Rate a recipe
- **URL**: `/recipes/:id/ratings`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**: `id` - Recipe ID
- **Request Body**:
  ```json
  {
    "value": 5
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": "recipe_id",
    "title": "Recipe Title",
    "ratings": [
      {
        "user": "user_id",
        "value": 5
      }
    ]
  }
  ```

### Get recipe rating
- **URL**: `/recipes/:id/ratings`
- **Method**: `GET`
- **Authentication**: None
- **URL Parameters**: `id` - Recipe ID
- **Success Response**: `200 OK`
  ```json
  {
    "average": 4.5,
    "total": 2
  }
  ```

## Comments

### Get recipe comments
- **URL**: `/recipes/:recipeId/comments`
- **Method**: `GET`
- **Authentication**: None
- **URL Parameters**: `recipeId` - Recipe ID
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": "comment_id",
      "recipe": "recipe_id",
      "user": {
        "id": "user_id",
        "name": "User Name"
      },
      "content": "Comment text",
      "createdAt": "date"
    }
  ]
  ```

### Create comment
- **URL**: `/recipes/:recipeId/comments`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**: `recipeId` - Recipe ID
- **Request Body**:
  ```json
  {
    "content": "Comment text"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "id": "comment_id",
    "recipe": {
      "id": "recipe_id",
      "title": "Recipe Title"
    },
    "user": {
      "id": "user_id",
      "name": "User Name"
    },
    "content": "Comment text",
    "createdAt": "date"
  }
  ```

### Delete comment
- **URL**: `/recipes/:recipeId/comments/:id`
- **Method**: `DELETE`
- **Authentication**: Required (must be comment author)
- **URL Parameters**:
  - `recipeId` - Recipe ID
  - `id` - Comment ID
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Commentaire supprimé avec succès"
  }
  ```

## Users

### Get all users
- **URL**: `/users`
- **Method**: `GET`
- **Authentication**: None
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  ]
  ```

### Get a specific user
- **URL**: `/users/:id`
- **Method**: `GET`
- **Authentication**: None
- **URL Parameters**: `id` - User ID
- **Success Response**: `200 OK`
  ```json
  {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
  ```

### Update user
- **URL**: `/users/:id`
- **Method**: `PATCH`
- **Authentication**: Required (must be the user)
- **URL Parameters**: `id` - User ID
- **Request Body** (all fields optional):
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": "user_id",
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```

### Update password
- **URL**: `/users/:id/update-password`
- **Method**: `PATCH`
- **Authentication**: Required (must be the user)
- **URL Parameters**: `id` - User ID
- **Request Body**:
  ```json
  {
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

### Delete user
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Authentication**: Required (must be the user)
- **URL Parameters**: `id` - User ID
- **Success Response**: `200 OK`
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

### Get user favorites
- **URL**: `/users/favorites`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": "recipe_id",
      "title": "Recipe Title",
      "description": "Recipe Description",
      "ingredients": ["ingredient1", "ingredient2"],
      "steps": ["step1", "step2"],
      "category": "plat",
      "author": {
        "id": "user_id",
        "name": "Author Name"
      },
      "image": {
        "url": "image_url"
      },
      "createdAt": "date"
    }
  ]
  ```

### Add recipe to favorites
- **URL**: `/users/favorites/:recipeId`
- **Method**: `PATCH`
- **Authentication**: Required
- **URL Parameters**: `recipeId` - Recipe ID
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Recipe added to favorites"
  }
  ```

### Remove recipe from favorites
- **URL**: `/users/favorites/:recipeId`
- **Method**: `DELETE`
- **Authentication**: Required
- **URL Parameters**: `recipeId` - Recipe ID
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Recipe removed from favorites"
  }
  ```
