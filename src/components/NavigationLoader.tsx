"use client";

import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { useLoader } from "@/context/LoaderContext";

export function NavigationLoader() {
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    // Show loader when route starts changing
    showLoader();

    // Hide loader after page has loaded (minimum 600ms so user can see it)
    const timer = setTimeout(() => {
      hideLoader();
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname]); // fires every time the URL/page changes

  return null;
}
