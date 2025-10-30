import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full text-white flex items-center justify-center select-none">
      {/* Background image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url(/bat_bg.png)",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: 'brightness(0.9)'
        }}
      />

      {/* Overlay */}
  <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 text-center space-y-6 px-6">
        <h1 className="jolly-lodger-regular text-7xl">404</h1>
        <p className="text-xl text-gray-300">This page went out for a midnight flight.</p>
        <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
