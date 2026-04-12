import { useState, useEffect } from "react";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

/**
 * Fetches all tags from GET /api/tags/.
 * Re-fetches when language changes.
 */
export default function useTags() {
  const { language } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/tags/")
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [language]);

  return { data, loading, error };
}
