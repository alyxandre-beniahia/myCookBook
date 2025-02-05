# MyCookBook API

## Overview
Backend API for MyCookBook, a recipe sharing platform built with Node.js, Express, and MongoDB.

## Features
- User Authentication
- Recipe Management 
- Image Upload (Cloudinary)
- Comments System
- Search Functionality

## Tech Stack
- Node.js
- Express
- MongoDB
- JWT Authentication
- Cloudinary
- Multer

## API Endpoints

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
```

### Recipes 
```bash
GET /api/recipes
POST /api/recipes
GET /api/recipes/:id
PUT /api/recipes/:id
DELETE /api/recipes/:id
GET /api/recipes/search
```
### Comments
```bash
POST /api/recipes/:recipeId/comments
GET /api/recipes/:recipeId/comments
DELETE /api/comments/:id
```
### Users
```bash
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```
### Environment Variables
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

## Getting Started

1.Clone the repository
2.Install dependencies: npm install
3.Create .env file with required variables
4.Run the server: npm start

## Upcoming Features

Recipe Rating System
User Favorites
Advanced Search
Password Reset
Email Verification