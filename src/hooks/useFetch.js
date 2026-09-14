import { useState, useEffect, useCallback, useMemo } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

  const fetchData = useCallback(async () => {
    if (!url) return;
    try {
      setLoading(true);
      setError(null);

      const parsedOptions = optionsKey ? JSON.parse(optionsKey) : {};
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          ...parsedOptions.headers,
        },
        ...parsedOptions,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, optionsKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

