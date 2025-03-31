import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoutes"; // Import the ProtectedRoute component

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipeCreatePage from "./pages/CreateRecipePage";
import RecipeEditPage from "./pages/EditRecipePage";
import RecipeSearchPage from "./pages/RecipeSearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen flex flex-col bg-background">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <LoginPage />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <RegisterPage />
                </Layout>
              }
            />
            <Route
              path="/recipes/search"
              element={
                <Layout>
                  <RecipeSearchPage />
                </Layout>
              }
            />
            <Route
              path="/recipes/:id"
              element={
                <Layout>
                  <RecipeDetailPage />
                </Layout>
              }
            />

            {/* Protected Routes using the ProtectedRoute component */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/recipes/create"
                element={
                  <Layout>
                    <RecipeCreatePage />
                  </Layout>
                }
              />
              <Route
                path="/recipes/edit/:id"
                element={
                  <Layout>
                    <RecipeEditPage />
                  </Layout>
                }
              />
              <Route
                path="/favorites"
                element={
                  <Layout>
                    <FavoritesPage />
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout>
                    <ProfilePage />
                  </Layout>
                }
              />
            </Route>

            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
