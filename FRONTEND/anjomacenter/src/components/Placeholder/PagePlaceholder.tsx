import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

interface PagePlaceholderProps {
  titre: string;
  sousTitre: string;
  description: string;
  icone: LucideIcon;
  points?: string[];
}

/**
 * Écran d'attente pour les modules pas encore développés.
 */
export default function PagePlaceholder({
  titre,
  sousTitre,
  description,
  icone: Icone,
  points = [],
}: PagePlaceholderProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">{titre}</h1>
      <p className="text-sm text-slate-500">{sousTitre}</p>

      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icone size={30} />
        </div>

        <h2 className="text-lg font-semibold text-slate-800">{description}</h2>

        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <Construction size={14} />
          Module en préparation
        </p>

        {points.length > 0 && (
          <ul className="mt-6 space-y-2 text-left text-sm text-slate-500">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
