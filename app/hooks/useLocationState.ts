import { useCallback, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

export const useLocationState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state: unknown = location.state;
  const latestState = useRef(state);

  useLayoutEffect(() => {
    latestState.current = location.state;
  }, [location]);

  const setState = useCallback(
    (update: (previous: unknown) => unknown) => {
      const next = update(latestState.current);
      if (Object.is(next, latestState.current)) {
        return;
      }
      latestState.current = next;
      void navigate(
        { pathname: location.pathname, search: location.search, hash: location.hash },
        { replace: true, preventScrollReset: true, defaultShouldRevalidate: false, state: next },
      );
    },
    [location.hash, location.pathname, location.search, navigate],
  );

  return [state, setState] as const;
};
