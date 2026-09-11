"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SwaggerUIComponent from "@/components/SwaggerUIComponent";

export default function ApiDocsPage() {
  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setStatus("denied");
      return;
    }

    fetch("/api/admin/api-spec", { headers: { "x-admin-token": token } })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => {
        setSpec(data);
        setStatus("ok");
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        setStatus("denied");
      });
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
        Checking access…
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin access required</h1>
        <p className="text-gray-500">
          API docs are only visible to logged-in admins.
        </p>
        <Link
          href="/admin"
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-colors"
        >
          Go to Admin Login
        </Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-4">
      <SwaggerUIComponent spec={spec} />
    </section>
  );
}
