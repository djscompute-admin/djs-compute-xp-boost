"use client";

import Image from "next/image";
import { useState } from "react";

export default function AboutParty() {
  const [lightsOut, setLightsOut] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const rounds = [
    {
      id: 1,
      name: "Round 1",
      games: [
        {
          id: 1,
          name: "AI or Fake: The Digital Detective",
          subtitle: "Identify real vs AI-generated media",
        },
        {
          id: 2,
          name: "Posture Perfect: The CNN Challenge",
          subtitle: "Test your body language against AI",
        },
        {
          id: 3,
          name: "Prompt Injection: The Keyword Heist",
          subtitle: "Extract the hidden keyword",
        },
        {
          id: 4,
          name: "The LLM Moneybags: Art of the Deal",
          subtitle: "Negotiate with an AI character",
        },
      ],
    },
    {
      id: 2,
      name: "Round 2",
      description: "Ludo of the Living Code",
      subtitle:
        "The Top 8 teams advance and compete in Tech Ludo matches with houses, dice rolls, and tech GK questions",
    },
    {
      id: 3,
      name: "Round 3",
      description: "Curse of the Cloned Code",
      subtitle:
        "The Top 8 teams from Round 1 advance to Round 2. In case of a tie, teams will replay one of the Round 1 games selected by the Core Team. The 8 teams are divided into 4 houses (4 members each) via chit-picking. Each house will play a Tech Ludo match. Six bowls contain chits with tech GK and basic coding questions. A dice roll determines how many spaces a team can move if they answer correctly. Incorrect answers result in no movement. The two houses securing 1st and 2nd place will qualify for the next stage. Teams from the 1st winning house will compete for 1st and 2nd place. Teams from the 2nd winning house will compete for 3rd place.",
    },
  ];

  const handleMouseDown = (gameId, roundId) => () => {
    setLightsOut(true);
    setSelectedGame({ gameId, roundId });
  };

  const handleMouseUp = () => {
    setLightsOut(false);
    setSelectedGame(null);
  };

  return (
    <section
      id="about-party"
      className="relative min-h-screen text-white py-20 overflow-hidden w-full"
    >
      {/* Background and overlay removed - will be on parent container */}

      {/* Decorative Skull - Left Side (positioned relative to viewport) */}
      <div
        className="absolute animate-float"
        style={{
          top: "30%",
          left: "0%",
          transform: "translateY(-50%)",
          zIndex: 1,
          animationDelay: "1s",
        }}
      >
        <Image
          src="/about_party/skull.png"
          alt="Skull"
          width={512}
          height={512}
          className="object-contain"
          style={{
            height: "60vh",
            width: "auto",
            maxHeight: "600px",
          }}
        />
      </div>

      {/* Decorative Spider - Inside skull's eye hole */}
      <div
        className="absolute animate-float"
        style={{
          top: "24%",
          left: "8%",
          transform: "translate(0, -70%)",
          zIndex: 1,
          animationDelay: "0.5s",
        }}
      >
        <Image
          src="/about_party/spider.png"
          alt="Spider"
          width={150}
          height={150}
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full">
        <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section with Arrows and Pumpkin */}
          <div className="text-center mb-8 md:mb-12 relative">
            {/* Pumpkin Scarecrow - Positioned to the right */}
            <div
              className="absolute hidden lg:block animate-float"
              style={{
                top: "30%",
                right: "-230px",
                transform: "translateY(-50%)",
                zIndex: -999,
                animationDelay: "0.5s",
              }}
            >
              <Image
                src="/about_party/pumpkin.png"
                alt="Pumpkin Scarecrow"
                width={400}
                height={600}
                className="object-contain"
                style={{
                  height: "50vh",
                  width: "auto",
                  maxHeight: "500px",
                }}
              />
            </div>

            {/* Title with Arrows */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="jolly-lodger-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-orange-500 uppercase tracking-wide">
                Join Us
              </h2>
              <div className="flex items-center gap-4 md:gap-8">
                <span className="jolly-lodger-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-orange-500">
                  →
                </span>
                <h2 className="jolly-lodger-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-red-500 uppercase tracking-wide">
                  This Year&apos;s Halloween Party!
                </h2>
                <span className="jolly-lodger-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-orange-500">
                  ←
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16 px-4">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed uppercase tracking-wide">
              Our Halloween party this year will be an unforgettable experience,
              filled with spooky decorations, eerie music, thrilling games, and
              costume contests. Join us for a night of magic and fright!
            </p>
          </div>

          {/* Single Tech-or-Treat Trials Heading */}
          <div className="jolly-lodger-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-orange-500 uppercase tracking-wider text-center mb-12">
            Tech-or-Treat Trials
          </div>

          {/* Rounds Container */}
          <div className="flex flex-col gap-16 items-center w-full">
            {rounds.map((round) => (
              <div key={round.id} className="w-full">
                {/* Round Title */}
                <div className="jolly-lodger-regular text-2xl sm:text-3xl md:text-4xl text-red-500 uppercase tracking-wide text-center mb-8">
                  {round.name}
                </div>

                {/* Games/Round Buttons */}
                {round.games ? (
                  <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12 lg:gap-16">
                    {round.games.map((game) => (
                      <div key={game.id} className="flex flex-col items-center">
                        <button
                          className="halloween-door-button"
                          aria-label={game.name}
                          onMouseDown={handleMouseDown(game.id, round.id)}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onTouchStart={handleMouseDown(game.id, round.id)}
                          onTouchEnd={handleMouseUp}
                        >
                          <div className="door-container">
                            <div className="door-frame-mini" />
                            <div className="door-mini">
                              <div className="door-panel-large-mini" />
                              <div className="door-panel-small-mini" />
                            </div>
                          </div>

                          {/* Left Pumpkin */}
                          <div className="pumpkin-mini left">
                            <div className="pumpkin-stem" />
                            <div className="pumpkin-segment center" />
                            <div className="pumpkin-segment left" />
                            <div className="pumpkin-segment right" />
                          </div>

                          {/* Right Pumpkin */}
                          <div className="pumpkin-mini right">
                            <div className="pumpkin-stem" />
                            <div className="pumpkin-segment center" />
                            <div className="pumpkin-segment left" />
                            <div className="pumpkin-segment right" />
                          </div>

                          {/* Lights Out Overlay */}
                          <div className="lights-out-overlay">
                            <div className="pumpkin-face-left" />
                            <div className="pumpkin-face-right" />
                          </div>
                        </button>

                        {/* Game Label Below Door */}
                        <div className="jolly-lodger-regular text-2xl sm:text-3xl md:text-4xl text-white mt-3">
                          Game {game.id}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start justify-center gap-8 md:gap-12 lg:gap-16">
                    <div className="flex flex-col items-center">
                      <button
                        className="halloween-door-button"
                        aria-label={round.description}
                        onMouseDown={handleMouseDown(1, round.id)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown(1, round.id)}
                        onTouchEnd={handleMouseUp}
                      >
                        <div className="door-container">
                          <div className="door-frame-mini" />
                          <div className="door-mini">
                            <div className="door-panel-large-mini" />
                            <div className="door-panel-small-mini" />
                          </div>
                        </div>

                        {/* Left Pumpkin */}
                        <div className="pumpkin-mini left">
                          <div className="pumpkin-stem" />
                          <div className="pumpkin-segment center" />
                          <div className="pumpkin-segment left" />
                          <div className="pumpkin-segment right" />
                        </div>

                        {/* Right Pumpkin */}
                        <div className="pumpkin-mini right">
                          <div className="pumpkin-stem" />
                          <div className="pumpkin-segment center" />
                          <div className="pumpkin-segment left" />
                          <div className="pumpkin-segment right" />
                        </div>

                        {/* Lights Out Overlay */}
                        <div className="lights-out-overlay">
                          <div className="pumpkin-face-left" />
                          <div className="pumpkin-face-right" />
                        </div>
                      </button>

                      {/* Round Label Below Door */}
                      <div className="jolly-lodger-regular text-2xl sm:text-3xl md:text-4xl text-white mt-3">
                        {round.name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lights Out Overlay */}
      <div className={`lights-out-fullscreen ${lightsOut ? "active" : ""}`}>
        {selectedGame && (
          <div className="game-content text-center">
            {(() => {
              const round = rounds.find((r) => r.id === selectedGame.roundId);
              if (round?.games) {
                const game = round.games.find(
                  (g) => g.id === selectedGame.gameId
                );
                return (
                  <>
                    <h1>{game?.name}</h1>
                    <div className="mt-4 mx-auto leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl text-red-500 jolly-lodger-regular w-[75%] animate-pulse">
                      {game?.subtitle}
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <h1>{round?.description || round?.name}</h1>
                    <div className="mt-4 mx-auto leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl text-red-500 jolly-lodger-regular w-[75%] animate-pulse">
                      {round?.subtitle}
                    </div>
                  </>
                );
              }
            })()}
          </div>
        )}
        {!selectedGame && <h1>Trick or Treat!</h1>}
      </div>
    </section>
  );
}
