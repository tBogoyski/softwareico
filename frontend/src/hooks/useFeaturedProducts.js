import { useState, useEffect } from "react";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

/**
 * Fetches featured products from GET /api/products/?is_featured=true.
 * Re-fetches when language changes.
 */
export default function useFeaturedProducts() {
  const { language } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products/", { params: { is_featured: true } })
      .then((res) => setData(res.data.results))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [language]);

  return { data, loading, error };
}
