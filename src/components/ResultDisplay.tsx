interface ScanResult {
  name_shop: string;
  out_price: number;
  quantity: number;
  sku: string;
}

interface ResultDisplayProps {
  result: ScanResult | null;
  error: string | null;
}

const formatPrice = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined) return '0.00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

export default function ResultDisplay({ result, error }: ResultDisplayProps) {
  return (
    <div className="w-full px-4 pb-4">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg w-full mb-4">
          {error}
        </div>
      )}
      
      {result && (
        <div className="w-full p-4 bg-white rounded-lg shadow-md border-2 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">{result.name_shop}</h2>
          <p className="text-gray-700">Price: RM {formatPrice(result.out_price)}</p>
          <p className="text-gray-700">Quantity: {result.quantity || 0}</p>
          <p className="text-gray-500 text-sm mt-2">SKU: {result.sku}</p>
        </div>
      )}
    </div>
  );
} 