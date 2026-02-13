export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
        <p className="text-green-600 font-bold text-xl mt-2">
          ${product.price.toFixed(2)}
        </p>
        <a 
          href={product.affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white text-center py-2 rounded mt-3 hover:bg-blue-700 transition-colors font-medium"
        >
          Shop Now on eBay
        </a>
      </div>
    </div>
  );
}
