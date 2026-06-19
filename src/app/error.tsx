"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught by Next.js:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 p-8 text-center font-sans">
      <h2 className="text-2xl font-bold mb-4">CRITICAL REACT ERROR CAUGHT</h2>
      <div className="bg-red-950 p-4 rounded-lg mb-6 max-w-2xl overflow-auto text-left">
        <p className="font-mono text-sm">{error.message || "Unknown error"}</p>
        {error.stack && (
          <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{error.stack}</pre>
        )}
      </div>
      <button
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
