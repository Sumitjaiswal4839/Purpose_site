"use client";

import React, { useEffect, useRef, useState } from "react";
import "swagger-ui-dist/swagger-ui.css";

interface SwaggerUIComponentProps {
  spec: any;
}

export default function SwaggerUIComponent({ spec }: SwaggerUIComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!spec || !containerRef.current) return;

    let isMounted = true;

    // Dynamically import local swagger-ui-dist inside useEffect (browser-only)
    import("swagger-ui-dist")
      .then((swaggerDist: any) => {
        if (!isMounted || !containerRef.current) return;

        const SwaggerUIBundle = swaggerDist.SwaggerUIBundle || swaggerDist.default?.SwaggerUIBundle;
        const SwaggerUIStandalonePreset =
          swaggerDist.SwaggerUIStandalonePreset || swaggerDist.default?.SwaggerUIStandalonePreset;

        if (!SwaggerUIBundle) {
          console.error("SwaggerUIBundle not found in swagger-ui-dist");
          setLoading(false);
          return;
        }

        containerRef.current.innerHTML = "";
        SwaggerUIBundle({
          spec,
          domNode: containerRef.current,
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            ...(SwaggerUIStandalonePreset ? [SwaggerUIStandalonePreset] : []),
          ],
          layout: "StandaloneLayout",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Swagger UI:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [spec]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-h-[600px]">
      {loading && (
        <div className="flex items-center justify-center p-12 text-gray-500 font-medium animate-pulse">
          Loading interactive API documentation…
        </div>
      )}
      <div ref={containerRef} className="swagger-container" />
    </div>
  );
}
