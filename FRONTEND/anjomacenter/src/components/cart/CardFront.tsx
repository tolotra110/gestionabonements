import React from "react";
import { AnjomaLogo } from "./AnjomaLogo";

export interface SubscriberData {
  nom: string;
  numeroAbonne: string;
  validite: string;
}

interface CardFrontProps {
  data: SubscriberData;
  className?: string;
}

/**
 * Recto de la carte d'abonné — proportions carte CR80 (85,6 × 54 mm).
 * Géométrie calée sur les visuels de référence (dossier anjoma-wifi-zone).
 */
export const CardFront: React.FC<CardFrontProps> = ({ data, className = "" }) => {
  const rows: Array<{
    key: keyof SubscriberData;
    label: string;
    y: number;
    icon: "user" | "badge" | "calendar";
  }> = [
    { key: "nom", label: "Nom :", y: 247, icon: "user" },
    { key: "numeroAbonne", label: "N° Abonné :", y: 323, icon: "badge" },
    { key: "validite", label: "Validité :", y: 399, icon: "calendar" },
  ];

  return (
    <div
      className={`relative w-full aspect-[860/543] rounded-[3.2%] overflow-hidden bg-white select-none shadow-[0_18px_45px_-12px_rgba(15,23,42,0.22),0_4px_14px_-4px_rgba(15,23,42,0.1)] ${className}`}
    >
      <svg
        viewBox="0 0 860 543"
        className="block w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Face avant de la carte d'abonné Anjoma WiFi Zone"
      >
        <defs>
          <clipPath id="front-card-clip">
            <rect x="0" y="0" width="860" height="543" rx="28" />
          </clipPath>

          {/* Halo bleu roi en bas à gauche, fondu vers le blanc */}
          <radialGradient id="front-left-glow" cx="11%" cy="72%" r="48%" fx="8%" fy="74%">
            <stop offset="0%" stopColor="#003ec9" />
            <stop offset="30%" stopColor="#0f63dd" />
            <stop offset="58%" stopColor="#6fb4f8" />
            <stop offset="84%" stopColor="#d6ecff" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Dégradé bleu roi du bandeau supérieur */}
          <radialGradient id="front-top-blue" cx="32%" cy="42%" r="75%" fx="28%" fy="40%">
            <stop offset="0%" stopColor="#0052e6" />
            <stop offset="48%" stopColor="#0038b8" />
            <stop offset="85%" stopColor="#002385" />
            <stop offset="100%" stopColor="#001966" />
          </radialGradient>

          <radialGradient id="front-top-highlight" cx="55%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#0b62f5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0038b8" stopOpacity="0" />
          </radialGradient>

          {/* Vert lime des bandes et du croissant */}
          <linearGradient id="front-lime-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7cd300" />
            <stop offset="50%" stopColor="#8ae000" />
            <stop offset="100%" stopColor="#78cc00" />
          </linearGradient>

          <linearGradient id="front-bottom-blue" x1="0%" y1="0%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#0042c7" />
            <stop offset="48%" stopColor="#002b96" />
            <stop offset="100%" stopColor="#001a6b" />
          </linearGradient>

          <linearGradient id="front-pill-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f5ff" />
            <stop offset="100%" stopColor="#e4edff" />
          </linearGradient>

          <linearGradient id="front-icon-blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0044d4" />
            <stop offset="100%" stopColor="#002796" />
          </linearGradient>

          <linearGradient id="front-watermark-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="55%" stopColor="#eef6ff" stopOpacity="0.68" />
            <stop offset="100%" stopColor="#d6e9ff" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <g clipPath="url(#front-card-clip)">
          {/* Fond blanc */}
          <rect x="0" y="0" width="860" height="543" fill="#ffffff" />

          {/* Halo bleu en bas à gauche */}
          <rect x="0" y="175" width="560" height="368" fill="url(#front-left-glow)" />

          {/* Filigrane Wi-Fi (point + 2 arcs) */}
          <g fill="none" stroke="url(#front-watermark-grad)" strokeLinecap="round">
            <circle cx="152" cy="411" r="24" fill="url(#front-watermark-grad)" stroke="none" />
            <path d="M 104 367 A 66 66 0 0 1 200 367" strokeWidth="25" />
            <path d="M 70 334 A 114 114 0 0 1 234 334" strokeWidth="25" />
          </g>

          {/* Croissant lime en haut à droite sous le bandeau bleu */}
          <path
            d="M 390 227 C 565 231, 730 198, 860 116 L 860 152 C 725 218, 545 236, 390 227 Z"
            fill="url(#front-lime-grad)"
          />

          {/* Bandeau bleu supérieur */}
          <path
            d="M 0 0 L 860 0 L 860 124 C 728 199, 542 227, 344 223 C 232 220, 130 213, 0 256 Z"
            fill="url(#front-top-blue)"
          />
          <path
            d="M 0 0 L 860 0 L 860 124 C 728 199, 542 227, 344 223 C 232 220, 130 213, 0 256 Z"
            fill="url(#front-top-highlight)"
          />

          {/* Repli bleu foncé en haut à droite */}
          <path
            d="M 744 0 L 860 0 L 860 124 C 785 165, 712 189, 635 200 C 712 142, 760 70, 744 0 Z"
            fill="#00165c"
            opacity="0.42"
          />

          {/* Repli sombre à gauche du bandeau */}
          <path
            d="M 0 256 C 48 231, 108 217, 178 218 C 108 207, 46 219, 0 238 Z"
            fill="#001a6e"
            opacity="0.45"
          />

          {/* Logo Anjoma WIFI ZONE */}
          <AnjomaLogo idPrefix="front-logo" transform="translate(-15, -13) scale(1.226)" />

          {/* Séparateur vertical blanc */}
          <line x1="375" y1="40" x2="375" y2="200" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />

          {/* CARTE D'ABONNÉ */}
          <g textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="800">
            <text
              x="587"
              y="104"
              fontSize="88"
              textLength="260"
              lengthAdjust="spacingAndGlyphs"
              fill="#8ce000"
            >
              CARTE
            </text>
            <text
              x="600"
              y="181"
              fontSize="84"
              textLength="347"
              lengthAdjust="spacingAndGlyphs"
              fill="#ffffff"
            >
              D’ABONNÉ
            </text>
          </g>

          {/* Lignes d'informations de l'abonné */}
          {rows.map((row) => {
            const cy = row.y + 26;
            return (
              <g key={row.key}>
                <rect
                  x="262"
                  y={row.y}
                  width="567"
                  height="52"
                  rx="26"
                  fill="url(#front-pill-bg)"
                  stroke="#2b4a9a"
                  strokeWidth="1.4"
                />

                <circle cx="292" cy={cy} r="30" fill="url(#front-icon-blue)" />

                {row.icon === "user" && (
                  <g fill="#ffffff">
                    <circle cx="292" cy={cy - 7.5} r="7.4" />
                    <path d={`M 278.5 ${cy + 13.5} C 278.5 ${cy + 2.7}, 305.5 ${cy + 2.7}, 305.5 ${cy + 13.5} Z`} />
                  </g>
                )}

                {row.icon === "badge" && (
                  <g>
                    <rect x="275" y={cy - 11} width="34" height="22" rx="3.2" fill="#ffffff" />
                    <circle cx="283.2" cy={cy - 3.5} r="3" fill="#0032ad" />
                    <path d={`M 278 ${cy + 6} C 278 ${cy + 1.2}, 288 ${cy + 1.2}, 288 ${cy + 6} Z`} fill="#0032ad" />
                    <rect x="292" y={cy - 5.5} width="13" height="2.6" rx="1" fill="#0032ad" />
                    <rect x="292" y={cy - 0.5} width="13" height="2.6" rx="1" fill="#0032ad" />
                    <rect x="292" y={cy + 4.4} width="9.5" height="2.6" rx="1" fill="#0032ad" />
                  </g>
                )}

                {row.icon === "calendar" && (
                  <g>
                    <rect x="284" y={cy - 16} width="3.8" height="6.5" rx="1.6" fill="#ffffff" />
                    <rect x="297" y={cy - 16} width="3.8" height="6.5" rx="1.6" fill="#ffffff" />
                    <rect x="277.5" y={cy - 12.5} width="29" height="26" rx="3.8" fill="#ffffff" />
                    <rect x="280.8" y={cy - 3.8} width="22.4" height="14" rx="1.6" fill="#0032ad" />
                    <rect x="283" y={cy - 1.6} width="4.3" height="3.9" rx="0.7" fill="#ffffff" />
                    <rect x="290" y={cy - 1.6} width="4.3" height="3.9" rx="0.7" fill="#ffffff" />
                    <rect x="297" y={cy - 1.6} width="4.3" height="3.9" rx="0.7" fill="#ffffff" />
                    <rect x="283" y={cy + 4.4} width="4.3" height="3.9" rx="0.7" fill="#ffffff" />
                    <rect x="290" y={cy + 4.4} width="4.3" height="3.9" rx="0.7" fill="#ffffff" />
                    <rect x="297" y={cy + 4.4} width="4.3" height="3.9" rx="0.7" fill="#ffffff" />
                  </g>
                )}

                <text
                  x="351"
                  y={cy + 13}
                  fontFamily="'Open Sans', sans-serif"
                  fontWeight="700"
                  fontSize="32"
                  fill="#0b2868"
                >
                  {row.label}
                </text>

                <text
                  x="600"
                  y={cy + 13}
                  fontFamily="'Open Sans', sans-serif"
                  fontWeight="700"
                  fontSize="27"
                  fill="#0b2868"
                >
                  {data[row.key]}
                </text>
              </g>
            );
          })}

          {/* Bande lime inférieure (croissant effilé) */}
          <path
            d="M 0 408 C 90 452, 230 496, 365 506 C 500 516, 660 486, 860 468 L 860 477 C 660 497, 500 530, 360 518 C 220 506, 85 468, 0 449 Z"
            fill="url(#front-lime-grad)"
          />

          {/* Liseré blanc sous la bande lime */}
          <path
            d="M 0 449 C 85 468, 220 506, 360 518 C 500 530, 660 497, 860 477 L 860 486 C 660 506, 500 538, 360 526 C 215 514, 80 476, 0 460 Z"
            fill="#ffffff"
          />

          {/* Vague bleu roi inférieure */}
          <path
            d="M 0 460 C 80 476, 215 514, 360 526 C 500 538, 660 506, 860 486 L 860 543 L 0 543 Z"
            fill="url(#front-bottom-blue)"
          />

          {/* Repli navy en bas à droite */}
          <path d="M 465 543 C 595 508, 735 481, 860 464 L 860 543 Z" fill="#001557" opacity="0.52" />
        </g>
      </svg>
    </div>
  );
};
