export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img 
        src={product.galleryURL} 
        alt={product.title} 
        className="w-full h-48 object-contain" 
      />
      <h3 className="font-bold mt-2 text-sm line-clamp-2">{product.title}</h3>
      <p className="text-green-600 font-bold mt-2">
        {product.sellingStatus?.[0]?.currentPrice?.[0]?.__value__} {product.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId']}
      </p>
      <a 
        href={product.viewItemURL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-blue-600 text-white text-center py-2 rounded mt-2 hover:bg-blue-700"
      >
        تسوق الآن
      </a>
    </div>
  );
}
