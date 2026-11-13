import type { AbonnementChartData } from "../../types/abonemment";

export function buildMonthlyData(createdDates: (string | null | undefined)[]): AbonnementChartData[] {
  const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const year = new Date().getFullYear();
  const counts = Array(12).fill(0);
  for (const d of createdDates) {
    if (!d) continue;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) continue;
    if (dt.getFullYear() !== year) continue;
    counts[dt.getMonth()] += 1;
  }
  return labels.map((periode, i) => ({ periode, abonnements: counts[i] }));
}

export function buildYearlyData(createdDates: (string | null | undefined)[]): AbonnementChartData[] {
  const year = new Date().getFullYear();
  const years = [year - 3, year - 2, year - 1, year];
  const counts = new Map<number, number>(years.map((y) => [y, 0]));
  for (const d of createdDates) {
    if (!d) continue;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) continue;
    const y = dt.getFullYear();
    if (counts.has(y)) counts.set(y, (counts.get(y) ?? 0) + 1);
  }
  return years.map((y) => ({ periode: String(y), abonnements: counts.get(y) ?? 0 }));
}
