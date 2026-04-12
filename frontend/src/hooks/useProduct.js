import { useState, useEffect } from "react";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

/**
 * Fetches a single product by slug from GET /api/products/:slug/.
 * Re-fetches when slug or language changes.
 */
export default function useProduct(slug) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    api
      .get(`/products/${slug}/`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { data, loading, error };
}
