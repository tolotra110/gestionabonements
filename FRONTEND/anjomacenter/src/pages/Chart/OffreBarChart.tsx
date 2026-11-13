import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Abonnement } from "../../types/abonemment";

interface OffreData {
  offre: string;
  nombre: number;
}

type TypeAbonnement = "Mensuelle" | "Annuelle";

function isAnnual(a: Abonnement): boolean {
  const d1 = a.dateDebut ? new Date(a.dateDebut) : null;
  const d2 = a.dateFin ? new Date(a.dateFin) : null;
  if (d1 && d2 && !Number.isNaN(d1.getTime()) && !Number.isNaN(d2.getTime())) {
    const days = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 300;
  }
  const text = `${a.offre ?? ""}`.toLowerCase();
  return text.includes("ann") || text.includes("year");
}

function buildOffreData(items: Abonnement[]): OffreData[] {
  const map = new Map<string, number>();
  for (const a of items) {
    const key = (a.offre || "Sans offre").trim() || "Sans offre";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([offre, nombre]) => ({ offre, nombre }))
    .sort((a, b) => b.nombre - a.nombre);
}

export default function OffreBarChart({ abonnements = [] }: { abonnements?: Abonnement[] }) {
  const [typeAbonnement, setTypeAbonnement] = useState<TypeAbonnement>("Mensuelle");

  const filtered = useMemo(
    () => abonnements.filter((a) => (typeAbonnement === "Annuelle" ? isAnnual(a) : !isAnnual(a))),
    [abonnements, typeAbonnement]
  );

  const data = useMemo(() => buildOffreData(filtered), [filtered]);

  return (
    <div className="m-3 h-120 w-132 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Répartition des offres</h2>
          <p className="mt-1 text-sm text-gray-500">Nombre d&apos;abonnements par offre</p>
        </div>

        <select
          value={typeAbonnement}
          onChange={(e) => setTypeAbonnement(e.target.value as TypeAbonnement)}
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="Mensuelle">Mensuelle</option>
          <option value="Annuelle">Annuelle</option>
        </select>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Type d&apos;abonnement</p>
          <p className="text-sm font-medium text-slate-800">{typeAbonnement}</p>
        </div>
        <p className="text-sm text-slate-600">Total: {filtered.length}</p>
      </div>

      <div className="h-[300px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Aucune donnée
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="offre" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value ?? 0, "Abonnements"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Line
                type="monotone"
                dataKey="nombre"
                stroke="#021742"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}