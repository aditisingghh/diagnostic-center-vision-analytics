import { useEffect, useState } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFetch<T>(
  url: string,
  fetcher?: () => Promise<T>,
  options?: { interval?: number; immediate?: boolean }
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = fetcher ? await fetcher() : null;
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }

    if (options?.interval) {
      const interval = setInterval(fetchData, options.interval * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
