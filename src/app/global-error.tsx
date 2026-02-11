"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-10 text-center font-sans">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-500 mb-6">We apologize for the inconvenience.</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
