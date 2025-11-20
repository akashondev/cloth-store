import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup") {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Verification email sent. Check your inbox.");
      return;
    }

    if (mode === "login") {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      // SAVE USER IN LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Name</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:ring-2 ring-blue-500">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:ring-2 ring-blue-500">
              <Mail size={18} />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:ring-2 ring-blue-500">
              <Lock size={18} />
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {mode === "signup" && <p className="text-xs text-gray-500">..</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-blue-600 font-medium ml-1"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
