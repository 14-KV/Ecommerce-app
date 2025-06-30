import { useState } from 'react';
import categoryImages from '../../data/categoryImages';

function CategoryCard({ category, onClick }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
    >
      <div className="relative w-full h-48">
        <img
          src={categoryImages[category]}
          alt={category}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          className={`w-full h-full object-cover transition duration-700 ease-in-out ${
            isLoading ? 'blur-md scale-105' : 'blur-0 scale-100'
          }`}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <span className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></span>
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold capitalize text-gray-800 group-hover:text-blue-600 transition">
          {category.replace('-', ' ')}
        </h3>
      </div>
    </div>
  );
}

export default CategoryCard;
