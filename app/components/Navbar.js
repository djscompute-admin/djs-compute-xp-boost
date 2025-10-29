'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/djs-compute-logo.png"
            alt="Dis Compute Logo"
            width={120}
            height={40}
            className="brightness-0 invert"
            priority
            style={{ width: 'auto', height: '40px' }}
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <Link href="/" className="hover:text-orange-500 transition-colors font-medium">
            Home
          </Link>
          <Link href="/gallery" className="hover:text-orange-500 transition-colors font-medium">
            Gallery
          </Link>
          <Link href="/about" className="hover:text-orange-500 transition-colors font-medium">
            About Party
          </Link>
          <Link href="/prize-pool" className="hover:text-orange-500 transition-colors font-medium">
            Prize Pool
          </Link>
          <Link href="/contacts" className="hover:text-orange-500 transition-colors font-medium">
            Contacts
          </Link>
        </div>

        {/* Reservation Button */}
        <Link 
          href="/reservation"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          Reservation
        </Link>
      </div>
    </nav>
  );
}
