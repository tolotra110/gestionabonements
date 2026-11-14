import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Search, Wallet } from "lucide-react";
import * as XLSX from "xlsx";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import { paiementService } from "../../services/paiementService";
import { parametreService } from "../../services/parametreService";
import type { Paiement } from "../../types/Paiement";

type Periode = "jour" | "semaine" | "mois" | "tout";

const PERIODES: { valeur: Periode; libelle: string }[] = [
  { valeur: "jour", libelle: "Aujourd'hui" },
  { valeur: "semaine", libelle: "Cette semaine" },
  { valeur: "mois", libelle: "Ce mois" },
  { valeur: "tout", libelle: "Tout" },
];

const parseMontant = (valeur?: string | number): number => {
  if (valeur === undefined || valeur === null) return 0;
  const nombre = Number(String(valeur).replace(/[^\d.-]/g, ""));
  return Number.isFinite(nombre) ? nombre : 0;
};

/** Accepte « 2026-11-08 » comme « 08/11/2026 ». */
function parseDate(date?: string): Date | null {
  if (!date) return null;
  const valeur = date.trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(valeur);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }

  const fr = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valeur);
  if (fr) {
    return new Date(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1]));
  }

  const dateJs = new Date(valeur);
  return Number.isNaN(dateJs.getTime()) ? null : dateJs;
}

function debutPeriode(periode: Periode, reference: Date): Date | null {
  if (periode === "tout") return null;

  const debut = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());

  if (periode === "jour") return debut;

  if (periode === "semaine") {
    // Semaine commençant le lundi
    const decalage = (debut.getDay() + 6) % 7;
    debut.setDate(debut.getDate() - decalage);
    return debut;
  }

  debut.setDate(1);
  return debut;
}

const formatMontant = (valeur: number, devise: string) =>
  `${valeur.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} ${devise}`;

export default function Caisse() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [devise, setDevise] = useState("Ar");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periode, setPeriode] = useState<Periode>("mois");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await paiementService.list();
        if (!ignore) setPaiements(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    parametreService
      .get()
      .then((p) => {
        if (!ignore && p.devise) setDevise(p.devise);
      })
      .catch(() => {
        /* la devise reste « Ar » si les paramètres sont indisponibles */
      });

    return () => {
      ignore = true;
    };
  }, []);

  const reference = useMemo(() => new Date(), []);

  const encaissements = useMemo(
    () =>
      paiements
        .map((paiement) => ({
          ...paiement,
          datePaiement: parseDate(paiement.date_paiement),
          montant: parseMontant(paiement.montant),
        }))
        .sort((a, b) => (b.datePaiement?.getTime() ?? 0) - (a.datePaiement?.getTime() ?? 0)),
    [paiements]
  );

  const totaux = useMemo(() => {
    const aujourdhui = debutPeriode("jour", reference) as Date;
    const debutMois = debutPeriode("mois", reference) as Date;

    return encaissements.reduce(
      (acc, item) => {
        if (!item.datePaiement) return acc;
        if (item.datePaiement >= aujourdhui) {
          acc.jour += item.montant;
          acc.nombreJour += 1;
        }
        if (item.datePaiement >= debutMois) {
          acc.mois += item.montant;
        }
        acc.total += item.montant;
        return acc;
      },
      { jour: 0, mois: 0, total: 0, nombreJour: 0 }
    );
  }, [encaissements, reference]);

  const filtres = useMemo(() => {
    const debut = debutPeriode(periode, reference);
    const terme = recherche.trim().toLowerCase();

    return encaissements.filter((item) => {
      if (debut && (!item.datePaiement || item.datePaiement < debut)) return false;
      if (!terme) return true;
      return `${item.client ?? ""} ${item.numero_abonnement ?? ""} ${item.offre ?? ""} ${item.methode ?? ""}`
        .toLowerCase()
        .includes(terme);
    });
  }, [encaissements, periode, reference, recherche]);

  const totalFiltre = filtres.reduce((somme, item) => somme + item.montant, 0);

  const exporterExcel = () => {
    const rows: (string | number)[][] = [
      ["Date", "Client", "N° abonnement", "Offre", "Méthode", `Montant (${devise})`],
      ...filtres.map((item) => [
        item.datePaiement ? item.datePaiement.toLocaleDateString("fr-FR") : "",
        item.client ?? "",
        item.numero_abonnement ?? `#${item.abonnement_id}`,
        item.offre ?? "",
        item.methode ?? "",
        item.montant,
      ]),
      ["Total", "", "", "", "", totalFiltre],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 24 },
      { wch: 20 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Caisse");

    const aujourdhui = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `caisse-${periode}-${aujourdhui}.xlsx`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />

      <div className="min-w-0 flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">CAISSE</h1>
          <p className="text-sm text-slate-500">Encaissements et versements des abonnements</p>

          {loading && (
            <div className="mt-6 flex items-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement des encaissements...
            </div>
          )}

          {!loading && error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

          {!loading && !error && (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Encaissé aujourd&apos;hui
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {formatMontant(totaux.jour, devise)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {totaux.nombreJour} encaissement{totaux.nombreJour > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Encaissé ce mois
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {formatMontant(totaux.mois, devise)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {reference.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total encaissé
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {formatMontant(totaux.total, devise)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {encaissements.length} versement{encaissements.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher un client, un numéro..."
                    className="w-[300px] rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={exporterExcel}
                    disabled={filtres.length === 0}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download size={16} />
                    Exporter Excel
                  </button>

                  {PERIODES.map((item) => (
                    <button
                      key={item.valeur}
                      type="button"
                      onClick={() => setPeriode(item.valeur)}
                      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                        periode === item.valeur
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.libelle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Client</th>
                      <th className="px-4 py-3 font-semibold">N° abonnement</th>
                      <th className="px-4 py-3 font-semibold">Offre</th>
                      <th className="px-4 py-3 font-semibold">Méthode</th>
                      <th className="px-4 py-3 text-right font-semibold">Montant</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filtres.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {item.datePaiement
                            ? item.datePaiement.toLocaleDateString("fr-FR")
                            : "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{item.client}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.numero_abonnement || `#${item.abonnement_id}`}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.offre || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{item.methode || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-800">
                          {formatMontant(item.montant, devise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {filtres.length > 0 && (
                    <tfoot className="border-t border-gray-100 bg-slate-50">
                      <tr>
                        <td
                          className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                          colSpan={5}
                        >
                          Total ({filtres.length})
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-slate-800">
                          {formatMontant(totalFiltre, devise)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>

                {filtres.length === 0 && (
                  <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                    <Wallet className="text-slate-300" size={28} />
                    <p className="text-sm text-slate-500">
                      Aucun encaissement pour cette période.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
