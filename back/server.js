const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recipes/:recipeId/comments', commentRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur tournant sur le port ${PORT}`));
