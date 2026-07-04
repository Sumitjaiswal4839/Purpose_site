"use client";

import { useEffect } from "react";

/**
 * Mounts an IntersectionObserver that adds `.visible` to any
 * element carrying the `.reveal` class once it enters the viewport.
 * Include this once in the main layout — no JSX output.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe all current .reveal elements
    const attach = () =>
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    attach();

    // Also observe elements added after initial render
    const mutation = new MutationObserver(attach);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
