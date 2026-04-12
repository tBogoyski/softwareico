import { useState, useEffect } from "react";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

/**
 * Fetches aggregate stats from GET /api/stats/.
 * Re-fetches when language changes.
 */
export default function useStats() {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/stats/")
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [language]);

  return { data, loading, error };
}
