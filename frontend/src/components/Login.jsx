import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-(--bg-primary) px-4 text-(--text-primary)">
      <div className="flex flex-col w-[90%] mx-auto max-w-110">
        <h1 className="text-[32px] font-bold mb-4 text-center">NotePad+</h1>
        <p className="mb-6 text-center text-[22px] font-bold">Welcome Back</p>

        <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-(--bg-secondary) border border-(--text-secondary) focus:border-(--btn-primary) focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg bg-(--bg-secondary) border border-(--text-secondary) focus:border-(--btn-primary) focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-1/2 translate-y-5/4 text-(--text-secondary) text-sm cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="text-(--btn-primary) text-sm text-right underline my-3"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full bg-(--btn-primary) transition-color py-3 rounded-lg font-bold cursor-pointer"
          >
            Log In
          </button>

          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-(--btn-primary) underline">
              Create new account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
