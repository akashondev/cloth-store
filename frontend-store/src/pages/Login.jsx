import React, { useState } from "react";
import heroImg from "../assets/login-hero.jpg";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function Login() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
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

      alert("Login successful!");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
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
              className="w-full bg-[#0D9488] hover:bg-[#0a7a6f] text-white py-3 rounded-lg font-medium"
            >
              {mode === "login" ? "Signin" : "Signup"}
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
      <div className="hidden lg:flex lg:w-1/2 h-screen items-center justify-center bg-[#CDC8C4] relative">
        {/* Realistic ground shadow - matches studio photography */}
        <div
          className="absolute bottom-[8%] w-[65%] h-[100px] 
                  bg-gradient-radial from-black/30 via-black/15 to-transparent 
                  blur-[60px] rounded-[100%] opacity-80"
        ></div>
        {/* Model PNG */}
        <img
          src={heroImg}
          alt="Hero"
          className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl"
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;
