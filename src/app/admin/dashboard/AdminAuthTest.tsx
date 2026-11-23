
"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { API_BASE_URL } from "@/app/lib/api";

export default function AdminAuthTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const testAdminAPI = async () => {
    try {
      setLoading(true);
      setResult("");

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(error?.message || "JWT token not found. Please login.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/test`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const resultData = await response.json();

      setResult(JSON.stringify(resultData, null, 2));
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border bg-white p-5">
      <h2 className="text-lg font-bold">Admin Authentication Test</h2>

      <button
        onClick={testAdminAPI}
        disabled={loading}
        className="mt-4 rounded-lg bg-rose-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Admin API"}
      </button>

      {result && (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm">
          {result}
        </pre>
      )}
    </div>
  );
}
