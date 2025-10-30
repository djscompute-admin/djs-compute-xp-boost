'use client';

import Image from 'next/image';

export default function Navbar() {
  const handleNavClick = (sectionId) => (e) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={handleNavClick('home')} className="flex items-center">
          <Image
            src="/djs-compute-logo.png"
            alt="Dis Compute Logo"
            width={120}
            height={40}
            className="brightness-0 invert"
            priority
            style={{ width: 'auto', height: '40px' }}
          />
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <a href="#home" onClick={handleNavClick('home')} className="hover:text-orange-500 transition-colors font-medium">Home</a>
          <a href="#teams" onClick={handleNavClick('teams')} className="hover:text-orange-500 transition-colors font-medium">Teams</a>
          <a href="#projects" onClick={handleNavClick('projects')} className="hover:text-orange-500 transition-colors font-medium">Projects</a>
          <a href="#contact" onClick={handleNavClick('contact')} className="hover:text-orange-500 transition-colors font-medium">Contact</a>
        </div>

        {/* Call-to-action */}
        <a
          href="#contact"
          onClick={handleNavClick('contact')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          Reservation
        </a>
      </div>
    </nav>
  );
}
