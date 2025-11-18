import React from "react";

function ProductList({ products, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p._id} className="bg-white shadow rounded-xl p-4">
          <img
            src={p.images?.[0]}
            alt={p.title}
            className="w-full h-60 object-cover rounded mb-4"
          />
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="text-gray-600">₹{p.price}</p>
          <p className="text-sm text-gray-500">{p.category}</p>

          <div className="flex justify-between mt-3">
            <button
              onClick={() => onEdit(p)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(p._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
