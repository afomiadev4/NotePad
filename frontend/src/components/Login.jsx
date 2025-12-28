import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(email, password)
      ? navigate("/dashboard")
      : alert("Invalid credentials try again!");
  };

  return (
    <div className="w-full h-screen bg-(--bg-primary) flex items-center justify-center p-5 text-(--text-primary)">
      <title>Login</title>
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-white/20">
        <h1 className="text-center font-extrabold text-5xl text-white drop-shadow-lg">
          Login
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-white font-semibold mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
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
