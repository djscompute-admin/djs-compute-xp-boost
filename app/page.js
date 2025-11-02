"use client";

import Image from "next/image";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrizePool from "./components/PrizePool";
import FAQ from "./components/FAQ";
import AboutParty from "./components/AboutParty";
import Leaderboard from './components/Leaderboard';
import Head from 'next/head';

export default function Home() {
  const containerRef = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);

  const MODEL_ID = "e9cc6714cac542f1804d4c7f7dac5583";

  const initSketchfab = () => {
    if (
      typeof window === "undefined" ||
      !containerRef.current ||
      !window.Sketchfab
    )
      return;

    // Clear any previous iframe on hot reload
    containerRef.current.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.title = "Halloween Scene";
    iframe.allow =
      "autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope";
    iframe.style.width = "100%";
    iframe.style.height = "120%";
    iframe.style.border = "0";
    containerRef.current.appendChild(iframe);

    const client = new window.Sketchfab(iframe);
    client.init(MODEL_ID, {
      autostart: 1,
      transparent: 1,
      scrollwheel: 0, // disable wheel zoom; drag still works
      ui_watermark: 0,
      ui_infos: 0,
      ui_hint: 0,
      ui_inspector: 0,
      ui_stop: 0,
      ui_ar: 0,
      ui_help: 0,
      ui_settings: 0,
      ui_vr: 0,
      ui_fullscreen: 0,
      ui_annotations: 0,
      ui_controls: 1,
      success: (api) => {
        api.addEventListener("viewerready", () => {
          setViewerReady(true);
        });
      },
      error: () => {
        // Fail-safe to hide loader if viewer doesn't fire ready
        setTimeout(() => setViewerReady(true), 4000);
      },
    });
  };

  // If the script was already loaded (hot reload), initialize
  useEffect(() => {
    if (typeof window !== "undefined" && window.Sketchfab) {
      initSketchfab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen w-full overflow-hidden bg-black select-none"
      >
        {/* Sketchfab 3D Background Scene via Viewer API */}
        <div className="absolute inset-0 z-10 overflow-hidden bg-black select-none">
          <div
            ref={containerRef}
            className="w-full h-full relative select-none"
            style={{ transform: "scale(1.15) translateY(-8%)" }}
          />
          {/* Loading GIF overlay */}
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 pointer-events-none select-none ${
              viewerReady ? "opacity-0" : "opacity-100"
            }`}
          >
            <Image
              src="/hero_section/loading.gif"
              alt="Loading 3D Model"
              width={160}
              height={160}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          {/* Gradient overlays to hide watermarks - do not block interaction */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/90 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-black/60 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-30 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
          {/* Top Text */}
          <div className="mb-12 animate-fade-in pointer-events-auto">
            <Image
              src="/hero_section/its_halloween_a_party_o_clock.png"
              alt="It's Halloween Party O'Clock"
              width={1000}
              height={120}
              className="w-full max-w-4xl h-auto select-none pointer-events-none"
              priority
            />
          </div>

          {/* Main Title */}
          <div className="mb-16 animate-float pointer-events-auto">
            <Image
              src="/hero_section/xp_boost.png"
              alt="Game Grid"
              width={2100}
              height={400}
              className="w-full max-w-6xl h-auto drop-shadow-2xl pointer-events-none select-none"
              priority
            />
          </div>

          {/* Scroll Down Arrow */}
          <button
            onClick={scrollToContent}
            className="animate-bounce cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
            aria-label="Scroll down"
          >
            <Image
              src="/hero_section/arrow.png"
              alt="Scroll down"
              width={60}
              height={60}
              className="opacity-80 hover:opacity-100 transition-opacity pointer-events-none"
              style={{ width: "auto", height: "auto" }}
            />
          </button>
        </div>
      </section>

      {/* Load Sketchfab viewer SDK */}
      <Script
        src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"
        strategy="afterInteractive"
        onLoad={initSketchfab}
      />

      {/* Leaderboard Section */}
     

    <div>
      <Head>
        <title>Spooky Leaderboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Creepster&display=swap" rel="stylesheet" />
        {/* You might want to prefetch images for the background here */}
      </Head>

      <main>
        {/* Other sections of your webpage can go here */}
        <Leaderboard />
        {/* More sections */}
      </main>
    </div>


      {/* About Party, Prize Pool & FAQ Container with Shared Background */}
      <div
        className="relative"
        style={{
          backgroundImage: "url(/witch_house_bg.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          backgroundAttachment: "scroll",
        }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/1" />

        {/* About Party Section */}
        <AboutParty />

        {/* Prize Pool Section */}
        <PrizePool />

        {/* FAQ Section */}
        <FAQ />
      </div>

      {/* Gradient Transition to Footer */}
      <div className="h-24 bg-linear-to-b from-transparent to-black" />

      {/* Footer (Contact) */}
      <Footer />
    </div>
  );
}
