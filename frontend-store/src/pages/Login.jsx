import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/login-hero.jpg";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // toast = { type: "success" | "error", message: string }
  const [toast, setToast] = useState(null);

  // Auto-dismiss the toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(
      () => setToast(null),
      toast.type === "success" ? 2500 : 4000,
    );
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async () => {
    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (mode === "signup" && !trimmedName) {
      setToast({ type: "error", message: "Please enter your name." });
      return;
    }

    if (!trimmedEmail) {
      setToast({ type: "error", message: "Please enter your email address." });
      return;
    }

    if (!trimmedPassword) {
      setToast({ type: "error", message: "Please enter your password." });
      return;
    }

    if (mode === "signup") {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(trimmedPassword)) {
        setToast({
          type: "error",
          message:
            "Password must be at least 6 characters and include letters and numbers only.",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("http://localhost:5000/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password: trimmedPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setToast({
            type: "error",
            message: data.error || "Could not create your account.",
          });
          return;
        }

        setToast({
          type: "success",
          message: data.message || "Account created. You can sign in now.",
        });
        setMode("login");
        return;
      }

      if (mode === "login") {
        const res = await fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
        });

        const data = await res.json();
        if (!res.ok) {
          setToast({
            type: "error",
            message: data.error || "Invalid email or password.",
          });
          return;
        }

        // Persist login details so they survive a refresh
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        setToast({
          type: "success",
          message: "Login successful! Redirecting...",
        });

        // Let the popup show briefly, then redirect with the login details attached
        setTimeout(() => {
          navigate("/", { state: { user: data.user, token: data.token } });
        }, 1200);
      }
    } catch (err) {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white relative">
      {/* Toast Popup */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-toast-in">
          <div
            className={`flex items-start gap-3 w-80 max-w-[90vw] px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm
            ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                : "bg-red-50/95 border-red-200 text-red-800"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.type === "success" ? (
              <CheckCircle2
                size={22}
                className="shrink-0 text-emerald-600 mt-0.5"
              />
            ) : (
              <XCircle size={22} className="shrink-0 text-red-600 mt-0.5" />
            )}
            <p className="text-sm font-medium flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Left Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left space-y-3">
            <h2 className="text-4xl font-bold text-[#0D9488] logo-font ">
              Stylin
            </h2>
            <h1 className="pt-2 text-3xl md:text-4xl font-normal text-gray-900">
              {mode === "login" ? "Get Started Now" : "Create Account"}
            </h1>
          </div>

          <div className="space-y-6">
            {mode === "signup" && (
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-900">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-900">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-900">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-gray-500">
                  Use at least 6 characters with letters and numbers only.
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="w-4 h-4" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the terms & policy
                </label>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#0D9488] hover:bg-[#0a7a6f] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Signin"
                  : "Signup"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-700">
            Have an account?
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-blue-600 ml-1 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Right Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 h-screen items-center justify-center bg-[#CDC8C4] relative overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[65%] h-[70%] animate-pulse rounded-lg"></div>
          </div>
        )}

        {/* Realistic ground shadow */}
        <div
          className={`absolute bottom-[6%] w-[70%] h-[95px] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.35)_0%,_rgba(0,0,0,0.20)_35%,_rgba(0,0,0,0.10)_60%,_rgba(0,0,0,0)_100%)] blur-[50px] opacity-80 rounded-full
          transition-opacity duration-1000
          ${imageLoaded ? "opacity-80" : "opacity-0"}`}
        ></div>

        {/* Model PNG */}
        <img
          src={heroImg}
          alt="Hero"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl
                     transition-all duration-1000 ease-out
                     ${
                       imageLoaded
                         ? "opacity-100 scale-100"
                         : "opacity-0 scale-95"
                     }`}
        />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-12px) translateX(12px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 1s ease-out;
        }

        .animate-toast-in {
          animation: toast-in 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;
