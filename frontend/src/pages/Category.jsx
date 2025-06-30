// src/pages/CategoryPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/cards/ProductCard.jsx';
import Spinner from '../components/layout/Spinner.jsx';

const Category = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/category/${name}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [name]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold capitalize mb-4 text-center text-gray-800">
        {name.replace('-', ' ')}
      </h2>
      {loading ? (
        <Spinner />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
};

export default Category;
