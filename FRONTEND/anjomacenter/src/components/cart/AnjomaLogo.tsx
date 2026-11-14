import React from "react";

interface AnjomaLogoProps {
  idPrefix: string;
  transform?: string;
  /** Corps du wordmark « Anjoma » (le recto et le verso n'ont pas les mêmes proportions sur les visuels de référence). */
  wordmarkFont?: number;
}

/**
 * Lockup SVG du logo Anjoma WIFI ZONE (espace local 320 x 180).
 * Proportions calées sur les visuels de référence : wordmark italique
 * large, capsule blanche fine, point vert à la place du point du « j »
 * et trois arcs Wi-Fi blancs.
 */
export const AnjomaLogo: React.FC<AnjomaLogoProps> = ({ idPrefix, transform, wordmarkFont = 74 }) => {
  const dotMaskId = `${idPrefix}-j-dot-mask`;
  const pillCutoutMaskId = `${idPrefix}-pill-cutout-mask`;

  // Arcs Wi-Fi centrés sur le point vert, inclinés vers le haut-droit
  const cx = 163;
  const cy = 85;
  const startAngle = (-104 * Math.PI) / 180;
  const endAngle = (-12 * Math.PI) / 180;

  const arcPath = (r: number) => {
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };

  return (
    <g transform={transform}>
      <defs>
        {/* Masque le point blanc natif du « j » pour ne garder que notre point vert */}
        <mask id={dotMaskId}>
          <rect x="-40" y="-40" width="400" height="280" fill="white" />
          <rect x="142" y="44" width="42" height="46" fill="black" />
        </mask>

        {/* Découpe nette dans la capsule blanche autour du jambage du « j » */}
        <mask id={pillCutoutMaskId}>
          <rect x="0" y="0" width="340" height="200" fill="white" />
          <text
            x="173"
            y="120"
            textAnchor="middle"
            fontFamily="'Open Sans', sans-serif"
            fontWeight="800"
            fontStyle="italic"
            fontSize={wordmarkFont}
            textLength="232"
            lengthAdjust="spacingAndGlyphs"
            fill="black"
            stroke="black"
            strokeWidth="9"
            strokeLinejoin="round"
            mask={`url(#${dotMaskId})`}
          >
            Anjoma
          </text>
        </mask>
      </defs>

      {/* Capsule blanche WIFI ZONE avec découpe propre du jambage */}
      <g mask={`url(#${pillCutoutMaskId})`}>
        <rect x="56" y="128" width="234" height="38" rx="19" fill="#ffffff" />
      </g>

      {/* Texte WIFI ZONE dans la capsule blanche */}
      <text
        x="173"
        y="154"
        textAnchor="middle"
        fontFamily="'Open Sans', sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="22"
        textLength="170"
        lengthAdjust="spacingAndGlyphs"
        fill="#003299"
      >
        WIFI ZONE
      </text>

      {/* Wordmark Anjoma en italique gras */}
      <text
        x="173"
        y="120"
        textAnchor="middle"
        fontFamily="'Open Sans', sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize={wordmarkFont}
        textLength="232"
        lengthAdjust="spacingAndGlyphs"
        fill="#ffffff"
        mask={`url(#${dotMaskId})`}
      >
        Anjoma
      </text>

      {/* Point vert Wi-Fi à la place du point du « j » */}
      <circle cx={cx} cy={cy} r="9.5" fill="#8be000" />

      {/* Trois arcs Wi-Fi blancs */}
      <path d={arcPath(18)} fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
      <path d={arcPath(30)} fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
      <path d={arcPath(42)} fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
};
