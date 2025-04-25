// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import categoryImages from '../data/categoryImages';

const categories = [
  'groceries',
  'fragrances',
  'skincare',
  'home-decoration',
  'furniture',
  'tops',
  'mens-shirts',
  'womens-dresses',
  'smartphones',
  'laptops',
];

const Home = () => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (category) => {
    setLoadedImages((prev) => ({ ...prev, [category]: true }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Welcome to Apni Dukaan 🛒</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Browse through a variety of product categories</p>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/category/${cat}`}
            className="rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition"
          >
            <div className="relative w-full h-40">
              {!loadedImages[cat] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                loading="lazy"
                src={categoryImages[cat]}
                alt={cat}
                onLoad={() => handleImageLoad(cat)}
                className={`w-full h-full object-cover transition duration-500 ease-in-out ${
                  loadedImages[cat] ? 'blur-0 scale-100' : 'blur-sm scale-105 opacity-0'
                }`}
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-lg font-semibold capitalize text-gray-700">
                {cat.replace('-', ' ')}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
