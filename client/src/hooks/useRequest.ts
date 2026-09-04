import { useCallback, useEffect, useState } from "react";

type RequestState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

export function useRequest<T>(request: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, error: null, loading: true }));

    request(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ data: null, error: error instanceof Error ? error : new Error("Request failed"), loading: false });
      });

    return () => controller.abort();
  }, [request, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...state, retry };
}
