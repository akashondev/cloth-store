import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "New Autumn Collection",
      description:
        "Discover our latest autumn collection featuring cozy sweaters, stylish jackets, and comfortable everyday wear for both men and women.",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      category: "New Arrivals",
    },
    {
      id: 2,
      title: "Men's Formal Wear",
      description:
        "Elevate your professional wardrobe with our premium selection of suits, dress shirts, and accessories designed for the modern gentleman.",
      image:
        "https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.jpg?s=2048x2048&w=is&k=20&c=KPnbXWbV0dJewQ5B1sbbcX7ox5UpuzHnrTrPVkLhdNc=",
      category: "Men's Fashion",
    },
    {
      id: 3,
      title: "Women's Summer Collection",
      description:
        "Light, breezy, and effortlessly chic. Explore our summer collection with flowing dresses, elegant tops, and versatile pieces.",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      category: "Women's Fashion",
    },
    {
      id: 4,
      title: "Casual Streetwear",
      description:
        "Stay comfortable and stylish with our urban streetwear collection. Featuring hoodies, joggers, sneakers, and trendy accessories.",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      category: "Casual Wear",
    },
    {
      id: 5,
      title: "Premium Denim Collection",
      description:
        "Quality denim that fits perfectly. Our collection includes classic jeans, denim jackets, and modern cuts for every body type.",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      category: "Denim",
    },
    {
      id: 6,
      title: "Active Lifestyle Wear",
      description:
        "Performance meets style. Our activewear collection keeps you comfortable during workouts and looks great anywhere you go.",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      category: "Activewear",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Our Collections
          </h1>
          <p className="text-2xl text-gray-200 font-light">
            Explore the latest trends and timeless classics
          </p>
        </div>
      </div>

      {/* Magazine Style Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Featured Item - Large */}
        <div className="mb-16 group cursor-pointer">
          <div className="relative h-96 md:h-[600px] overflow-hidden rounded-xl">
            <img
              src={posts[0].image}
              alt={posts[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {posts[0].category}
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mb-4 group-hover:text-purple-300 transition-colors duration-300">
                {posts[0].title}
              </h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
                {posts[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {posts.slice(1, 3).map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden mb-6 rounded-xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-3xl font-bold group-hover:text-purple-300 transition-colors duration-300">
                    {post.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed px-2">
                {post.description}
              </p>
            </div>
          ))}
        </div>

        {/* Three Column Compact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(3, 6).map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden mb-4 rounded-xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {post.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
