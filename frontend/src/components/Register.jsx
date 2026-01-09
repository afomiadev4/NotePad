import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (form.username.trim().includes(" "))
      newErrors.username = "Username cannot contain spaces";
    if (!form.email.includes("@")) newErrors.email = "Valid email is required";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          { 
            id: data.user.id, 
            username: form.username, 
            full_name: form.name 
          }
        ]);
        
      if (profileError) console.error("Profile creation error:", profileError.message);
    }

    alert("Check your email to verify your account!");
    navigate("/login");
  };

  return (
    <div className="w-full h-screen bg-(--bg-primary) flex items-center justify-center p-5 text-(--text-primary) overflow-hidden">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-white/20">
        <h2 className="text-center font-extrabold text-5xl drop-shadow-lg">
          Register
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className=" font-semibold mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 placeholder-white/70 outline-none transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className=" font-semibold mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 placeholder-white/70 outline-none transition"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className=" font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 placeholder-white/70 outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className=" font-semibold mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 placeholder-white/70 outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className="text-(--text-primary) font-semibold mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="px-4 py-2 text-(--text-primary) rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 placeholder-white/70 outline-none transition"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-(--btn-primary) transition font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg mt-4 cursor-pointer"
          >
            Sign Up
          </button>
          <div className="flex mt-2 justify-between">
            Already have an account?
            <Link
              to="/login"
              className="text-(--text-secondary) hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}