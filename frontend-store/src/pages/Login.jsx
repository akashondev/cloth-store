import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function Login() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
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
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-0 relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Fashion Model Section */}
        <div className="w-full lg:w-1/2 relative bg-gray-50 flex items-center justify-center p-8 lg:p-12 animate-fade-in">
          <div className="absolute top-8 left-8 z-10">
            <h2 className="text-3xl md:text-4xl font-light tracking-widest logo-font text-gray-800">
              STYLINN
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <img
              src="https://img.freepik.com/free-photo/stylish-european-brunette-woman-red-coat-black-hat-posing-white-wall_273443-4654.jpg?ga=GA1.1.978397244.1763226310&semt=ais_hybrid&w=740&q=80"
              alt="Fashion Model"
              className="w-full h-auto object-cover rounded-2xl shadow-lg"
            />

            {/* Decorative geometric elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-[#0D9488] rounded-full opacity-30"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 border-2 border-cyan-300 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16 animate-slide-in">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl price-down font-light tracking-wide text-gray-800">
                {mode === "login" ? "LOGIN" : "SIGN UP"}
              </h1>
            </div>

            <div className="space-y-6">
              {mode === "signup" && (
                <div className="flex flex-col space-y-2 animate-fade-in">
                  <label className="text-xs font-light tracking-wider text-gray-600 uppercase">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder=""
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full outline-none text-gray-700 border-b-2 border-gray-200 focus:border-[#0D9488] py-3 transition duration-300 bg-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-light tracking-wider text-gray-600 uppercase">
                  {mode === "login" ? "Username" : "Email"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none text-gray-700 border-b-2 border-gray-200 focus:border-[#0D9488] py-3 transition duration-300 bg-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-light tracking-wider text-gray-600 uppercase">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs text-[#0D9488] hover:text-teal-700 font-light tracking-wide transition"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none text-gray-700 border-b-2 border-gray-200 focus:border-[#0D9488] py-3 pr-10 transition duration-300 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D9488] transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#0D9488] hover:bg-teal-700 rounded-md text-white py-4  font-light tracking-widest text-sm uppercase transition duration-300 mt-8"
              >
                {mode === "login" ? "Submit" : "Create Account"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600  font-light pt-6">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-[#0D9488] hover:text-teal-700 font-normal ml-2 transition"
              >
                {mode === "login" ? "Create an Account" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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
