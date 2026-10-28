import { useCallback, useEffect, useState } from "react";

/**
 * Runs an API call and tracks its state.
 *
 *   const { data, loading, error, refetch } = useFetch(
 *     () => apiClient.get("/vendors", { params: { city } }),
 *     [city] // runs again whenever city changes
 *   );
 *
 * data       -> body.data from the backend (e.g. the vendors array)
 * pagination -> body.pagination, when the endpoint has it
 * error      -> a message that is safe to show in the UI
 * errorStatus -> HTTP status of the failure (e.g. 404), undefined for network errors
 * refetch    -> call it from a "Try again" button
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(undefined);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // If deps change before this request finishes, ignore its result.
    // Stops an old, slow response from overwriting a newer filter's data.
    let ignore = false;

    setLoading(true);
    setError(null);
    setErrorStatus(undefined);

    fetcher()
      .then((body) => {
        if (ignore) return;
        setData(body.data);
        setPagination(body.pagination ?? null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setErrorStatus(err.status);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // The caller decides when to refetch through deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, pagination, loading, error, errorStatus, refetch };
}
