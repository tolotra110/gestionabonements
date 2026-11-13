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
import { buildMonthlyData, buildYearlyData } from "../../components/Data/abonnementData";

export default function AbonnementChart({ abonnements = [] }: { abonnements?: Abonnement[] }) {
  const [periode, setPeriode] = useState<"mensuelle" | "annuelle">("mensuelle");

  const data = useMemo(() => {
    const dates = abonnements.map((a) => a.created_at);
    return periode === "mensuelle" ? buildMonthlyData(dates) : buildYearlyData(dates);
  }, [abonnements, periode]);

  return (
    <div className="m-2 w-133 rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Répartition des abonnements</h2>
          <p className="text-sm text-gray-500">Nombre d&apos;abonnements par période (créés)</p>
        </div>

        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value as "mensuelle" | "annuelle")}
          className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="mensuelle">Mensuelle</option>
          <option value="annuelle">Annuelle</option>
        </select>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periode" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="abonnements"
              name="Abonnements"
              stroke="#030d3a"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
