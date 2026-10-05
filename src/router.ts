import { useState, useEffect, useCallback } from "react";

export type Route =
  | ""
  | "home"
  | "explore"
  | "navigate"
  | "directions"
  | "gallery"
  | "guide"
  | "resources";

const PLACE_PREFIX = "#/place/";

export function getCurrentRoute(): { route: Route; param: string | null } {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [path, param] = hash.split("/");
  const validRoutes: Route[] = ["home", "explore", "navigate", "directions", "gallery", "guide", "resources"];
  if (path === "place" && param) {
    return { route: "" as Route, param };
  }
  if (validRoutes.includes(path as Route)) {
    return { route: path as Route, param: null };
  }
  return { route: "home", param: null };
}

export function navigateTo(route: Route) {
  window.location.hash = `/${route}`;
}

export function navigateToPlace(id: string) {
  window.location.hash = `/place/${id}`;
}

export function useRouter() {
  const [state, setState] = useState(getCurrentRoute());

  useEffect(() => {
    const handler = () => {
      setState(getCurrentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((route: Route) => {
    navigateTo(route);
  }, []);

  const navigatePlace = useCallback((id: string) => {
    navigateToPlace(id);
  }, []);

  return { ...state, navigate, navigatePlace };
}
