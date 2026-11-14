import React from "react";
import { AnjomaLogo } from "./AnjomaLogo";

interface CardBackProps {
  className?: string;
}

/**
 * Verso de la carte d'abonné — mêmes proportions CR80 que le recto.
 * Géométrie calée sur les visuels de référence (dossier anjoma-wifi-zone).
 */
export const CardBack: React.FC<CardBackProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full aspect-[860/543] rounded-[3.2%] overflow-hidden bg-[#002899] select-none shadow-[0_18px_45px_-12px_rgba(15,23,42,0.22),0_4px_14px_-4px_rgba(15,23,42,0.1)] ${className}`}
    >
      <svg
        viewBox="0 0 860 543"
        className="block w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Face arrière de la carte d'abonné Anjoma WiFi Zone"
      >
        <defs>
          <clipPath id="back-card-clip">
            <rect x="0" y="0" width="860" height="543" rx="28" />
          </clipPath>

          <radialGradient id="back-blue-bg" cx="50%" cy="49%" r="68%" fx="50%" fy="48%">
            <stop offset="0%" stopColor="#0052eb" />
            <stop offset="44%" stopColor="#003ac2" />
            <stop offset="80%" stopColor="#002185" />
            <stop offset="100%" stopColor="#00165c" />
          </radialGradient>

          <linearGradient id="back-lime-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#77cc00" />
            <stop offset="50%" stopColor="#8be000" />
            <stop offset="100%" stopColor="#7cd300" />
          </linearGradient>

          <linearGradient id="back-corner-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#002694" />
            <stop offset="100%" stopColor="#001454" />
          </linearGradient>
        </defs>

        <g clipPath="url(#back-card-clip)">
          {/* Fond bleu roi pleine page */}
          <rect x="0" y="0" width="860" height="543" fill="url(#back-blue-bg)" />

          {/* Balayage bleu en haut à gauche */}
          <path d="M 0 0 L 318 0 C 228 93, 120 180, 0 256 Z" fill="#001f7a" opacity="0.85" />
          <path d="M 0 0 L 220 0 C 148 78, 78 143, 0 204 Z" fill="#0a5be8" opacity="0.22" />

          {/* Croissant lime effilé en haut à gauche */}
          <path
            d="M 0 185 C 100 130, 200 60, 270 0 L 328 0 C 250 78, 120 165, 0 176 Z"
            fill="url(#back-lime-grad)"
          />

          {/* Liseré brillant le long du pli */}
          <path
            d="M 0 185 C 100 130, 200 60, 270 0"
            fill="none"
            stroke="#1e78ff"
            strokeWidth="3"
            opacity="0.45"
          />

          {/* Croissant lime effilé en bas à droite */}
          <path
            d="M 500 543 C 670 505, 800 420, 860 320 L 860 372 C 800 462, 690 520, 540 543 Z"
            fill="url(#back-lime-grad)"
          />

          {/* Swoosh blanc en bas à droite */}
          <path
            d="M 540 543 C 690 520, 800 462, 860 372 L 860 415 C 800 495, 700 535, 580 543 Z"
            fill="#ffffff"
          />

          {/* Coin cobalt foncé en bas à droite */}
          <path d="M 580 543 C 700 535, 800 495, 860 415 L 860 543 Z" fill="url(#back-corner-dark)" />

          <path d="M 660 543 C 752 510, 822 455, 860 390 L 860 543 Z" fill="#00124d" opacity="0.55" />

          {/* Logo Anjoma WIFI ZONE centré */}
          <AnjomaLogo
            idPrefix="back-logo"
            transform="translate(79.8, 40.3) scale(2.021)"
            wordmarkFont={52}
          />
        </g>
      </svg>
    </div>
  );
};
