'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNavClick = (sectionId) => (e) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      // Account for the fixed navbar height so target isn't hidden under it
      const navEl = document.querySelector('nav');
      const navHeight = navEl ? navEl.offsetHeight : 64;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Calculate hero height if present, fallback to 80px
    const getHeroThreshold = () => {
      const hero = document.getElementById('home');
      if (hero) return hero.offsetHeight;
      return 80;
    };

    let threshold = getHeroThreshold();

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setIsScrolled(y > threshold);
    };

    const onResize = () => {
      threshold = getHeroThreshold();
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // run once
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-black/40 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a 
          href="https://www.djscompute.in/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center"
        >
          <Image
            src="/djs-compute-logo.png"
            alt="Dis Compute Logo"
            width={240}
            height={110}
            className="brightness-0 invert h-14 md:h-16"
            priority
            style={{ width: 'auto', height: '56px' }}
          />
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <a href="#home" onClick={handleNavClick('home')} className="font-semibold text-lg uppercase tracking-wide hover:text-orange-500 transition-all">Home</a>
          <a href="#leaderboard" onClick={handleNavClick('leaderboard')} className="font-semibold text-lg uppercase tracking-wide hover:text-orange-500 transition-all">Leaderboard</a>
          <a href="#about-party" onClick={handleNavClick('about-party')} className="font-semibold text-lg uppercase tracking-wide hover:text-orange-500 transition-all">About Party</a>
          <a href="#prize-pool" onClick={handleNavClick('prize-pool')} className="font-semibold text-lg uppercase tracking-wide hover:text-orange-500 transition-all">Prize Pool</a>
          <a href="#contact" onClick={handleNavClick('contact')} className="font-semibold text-lg uppercase tracking-wide hover:text-orange-500 transition-all">Contact</a>
        </div>

        {/* Call-to-action */}
        <a
          href="https://forms.gle/ZPR8EcxSGZSgBQWQ9"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold text-xs md:text-lg transition-all transform hover:scale-105 nosifer-regular"
        >
          Register Now
        </a>
      </div>
    </nav>
  );
}
