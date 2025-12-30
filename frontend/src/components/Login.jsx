import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate API call
    const userData = { email, name: email.split("@")[0] };
    const token = "dummy-token-" + Date.now();

    dispatch(login({ user: userData, token }));
    navigate("/folders");
  };

  return (
    <div className="w-full h-screen bg-(--bg-primary) flex items-center justify-center p-5 text-(--text-primary)">
      <title>Login</title>
      <div className="bg-(--bg-primary) backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-white/20">
        <h1 className="text-center font-extrabold text-5xl text-( --text-primary) drop-shadow-lg">
          Login
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-( --text-primary) font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-(--border-color) focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="text-( --text-primary) font-semibold mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-(--border-color) focus:ring-2 focus:ring-blue-400 text-( --text-primary) placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="absolute top-1/2 translate-y-0.5 right-2 cursor-pointer"
              type="button"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="bg-(--btn-primary) transition font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg mt-4 cursor-pointer"
          >
            Login
          </button>
          <div className="flex mt-4 justify-between">
            Don't have an account?
            <Link
              to="/register"
              className="text-(--text-secondary) hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
