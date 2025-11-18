import React, { useState } from "react";
import {
  Mail,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div
        style={{ backgroundColor: "#F8F4EC" }}
        className="text-black relative"
      >
        {/* Blur effect at top edge */}
        {/* <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm"></div> */}
        <div
          className="h-32 rounded-lg"
          style={{
            background: "linear-gradient(to bottom, #F3F4F6,#F8F4EC)",
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Stay in Style
              </h3>
              <p className="text-gray-700">
                Get exclusive deals, style tips, and new arrivals first
              </p>
            </div>
            <div onSubmit={handleSubscribe} className="w-full md:w-auto">
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                >
                  {subscribed ? (
                    "✓ Subscribed"
                  ) : (
                    <>
                      <Send size={18} /> Subscribe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-bold mb-4 logo-font">Styllin</h3>
            <p className="text-gray-400 mb-4">
              Your destination for the latest trends and timeless classics.
              Elevate your wardrobe with Styllin.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Men's Collection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Women's Collection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Customer Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>
                  123 Fashion Avenue
                  <br />
                  Style District, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <span>hello@styllin.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Styllin. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
