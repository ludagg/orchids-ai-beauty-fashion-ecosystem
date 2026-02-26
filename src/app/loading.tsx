export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-white"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">Loading...</p>
    </div>
  );
}
