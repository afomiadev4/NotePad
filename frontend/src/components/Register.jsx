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
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          username: form.username,
          full_name: form.name,
        },
      ]);

      if (profileError)
        console.error("Profile creation error:", profileError.message);
    }

    alert("Check your email to verify your account!");
    navigate("/login");
  };

  return (
    <div className="w-full h-screen bg-[var(--bg-page)] flex items-center justify-center p-5 text-[var(--text-main)] overflow-hidden transition-colors duration-300">
      <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-[var(--border-subtle)]">
        <h2 className="text-center font-extrabold text-5xl drop-shadow-sm text-[var(--text-main)]">
          Register
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              className="font-semibold mb-1 text-[var(--text-main)]"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 placeholder-[var(--text-faint)] text-[var(--text-main)] outline-none transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              className="font-semibold mb-1 text-[var(--text-main)]"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 placeholder-[var(--text-faint)] text-[var(--text-main)] outline-none transition"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              className="font-semibold mb-1 text-[var(--text-main)]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 placeholder-[var(--text-faint)] text-[var(--text-main)] outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className="font-semibold mb-1 text-[var(--text-main)]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 placeholder-[var(--text-faint)] text-[var(--text-main)] outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className="text-[var(--text-main)] font-semibold mb-1"
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
              className="px-4 py-2 text-[var(--text-main)] rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 placeholder-[var(--text-faint)] outline-none transition"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white transition font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg mt-4 cursor-pointer"
          >
            Sign Up
          </button>
          <div className="flex mt-2 justify-between text-[var(--text-muted)]">
            Already have an account?
            <Link
              to="/login"
              className="text-[var(--accent-primary)] hover:underline font-bold"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
