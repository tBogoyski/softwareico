import { useState, useEffect } from "react";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

/**
 * Fetches products from GET /api/products/ with filters, search, ordering, and pagination.
 * Re-fetches when params or language changes.
 */
export default function useProducts(params = {}) {
  const { language } = useLanguage();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const cleanParams = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== "" && value !== null && value !== undefined) {
        cleanParams[key] = value;
      }
    }

    api
      .get("/products/", { params: cleanParams })
      .then((res) => {
        setData(res.data.results);
        setCount(res.data.count);
        setNext(res.data.next);
        setPrevious(res.data.previous);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, language]);

  return { data, count, next, previous, loading, error };
}
