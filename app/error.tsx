'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    const timer = window.setTimeout(reset, 10000);
    return () => window.clearTimeout(timer);
  }, [error, reset]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-white" role="alert">
      <h2 className="text-2xl font-bold mb-4">Die Inhalte konnten gerade nicht geladen werden.</h2>
      <p className="mb-4">Wir versuchen es automatisch erneut.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
