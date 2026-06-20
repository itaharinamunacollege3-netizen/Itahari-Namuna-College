import { useCallback, useEffect, useState } from "react";

export function useAsyncData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, meta, loading, error, reload };
}
