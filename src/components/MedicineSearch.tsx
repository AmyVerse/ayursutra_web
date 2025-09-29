import { useState } from "react";

interface Medicine {
  // Name variations
  name?: string;
  Medicine?: string;

  // Source variations
  source?: string;
  Source?: string;

  // Price variations
  price?: string;
  Price?: string;

  // Links
  Link?: string;
  link?: string;
  url?: string;

  // Additional details
  description?: string;
  brand?: string;
  Brand?: string;
  rating?: string | number;
  Rating?: string | number;
  stock?: string;
  Stock?: string;

  // Catch-all for any other properties
  [key: string]: any;
}

interface SearchResponse {
  medicines?: Medicine[];
  [key: string]: any;
}

export default function MedicineSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medicine[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMedicines = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/medicines/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine_name: query }),
      });

      if (!response.ok) {
        throw new Error("API error: " + response.status);
      }

      const data: SearchResponse = await response.json();
      const medicines = data.medicines || [];
      setResults(medicines);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getMedicineName = (med: Medicine) =>
    med.name || med.Medicine || "Unknown Medicine";
  const getMedicineSource = (med: Medicine) =>
    med.source || med.Source || "Unknown Source";
  const getMedicinePrice = (med: Medicine) =>
    med.price || med.Price || "Price not available";
  const getMedicineLink = (med: Medicine) => med.Link || med.link || med.url;
  const getMedicineBrand = (med: Medicine) => med.brand || med.Brand;
  const getMedicineRating = (med: Medicine) => med.rating || med.Rating;
  const getMedicineStock = (med: Medicine) => med.stock || med.Stock;

  return (
    <div className="medicine-search h-full flex flex-col">
      <div className="search-input flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicine (e.g. Ashwagandha)"
          onKeyDown={(e) => e.key === "Enter" && searchMedicines()}
          className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
        />
        <button
          onClick={searchMedicines}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all text-sm disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="results flex-1 overflow-y-auto">
        {loading && (
          <div className="text-center text-gray-500 text-sm py-8">
            <em>Searching...</em>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-sm py-8">
            <span>Error: {error}</span>
          </div>
        )}

        {results && results.length > 0 && (
          <div>
            <div className="font-semibold text-emerald-700 mb-3 text-sm">
              Results for '<span className="text-emerald-600">{query}</span>':
            </div>
            <div className="grid gap-3">
              {results.map((med, idx) => (
                <div
                  key={idx}
                  className="medicine-card bg-white rounded-lg p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm flex-1">
                      {getMedicineName(med)}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getMedicineSource(med)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600">
                      {getMedicinePrice(med)}
                    </span>
                    {getMedicineLink(med) && (
                      <a
                        href={getMedicineLink(med)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded hover:bg-emerald-600 transition-colors"
                      >
                        View Details →
                      </a>
                    )}
                  </div>

                  {/* Additional details if available */}
                  {med.description && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {med.description}
                    </p>
                  )}

                  {getMedicineBrand(med) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Brand: {getMedicineBrand(med)}
                    </p>
                  )}

                  {getMedicineRating(med) && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">Rating: </span>
                      <span className="text-xs font-medium text-yellow-600 ml-1">
                        {getMedicineRating(med)} ⭐
                      </span>
                    </div>
                  )}

                  {getMedicineStock(med) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Stock: {getMedicineStock(med)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results && results.length === 0 && !loading && (
          <div className="text-center text-gray-500 text-sm py-8">
            <em>No results found.</em>
          </div>
        )}
      </div>
    </div>
  );
}
