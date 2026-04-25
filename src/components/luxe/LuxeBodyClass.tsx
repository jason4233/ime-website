"use client";

import { useEffect } from "react";

// Adds .luxe-mode to <html> while /luxe is mounted; removes on unmount.
// CSS in luxe layout uses html.luxe-mode to hide root chrome.
export function LuxeBodyClass() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("luxe-mode");
    return () => {
      html.classList.remove("luxe-mode");
    };
  }, []);
  return null;
}
