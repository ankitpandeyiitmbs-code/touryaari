export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-gold rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-stone font-medium">Loading...</p>
      </div>
    </div>
  );
}
