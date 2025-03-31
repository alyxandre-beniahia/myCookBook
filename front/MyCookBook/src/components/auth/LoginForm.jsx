import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import GooeyButton from "../layout/GooeyButton";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(formData);
      authLogin(response.user, response.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
            placeholder="••••••••"
          />
        </div>

        {isLoading ? (
          <button
            disabled
            className="w-full py-2 px-4 bg-[#262633] text-white rounded-md opacity-70 cursor-not-allowed"
          >
            Logging in...
          </button>
        ) : (
          <GooeyButton
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-[#262633] text-white rounded-md hover:bg-[#333344] transition-colors"
            colors={["white", "white", "white", "white"]}
            hoverColor="#333344"
          >
            Login
          </GooeyButton>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
