import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Wallet } from "lucide-react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import { abonnementService } from "../../services/abonnementService";
import { parametreService } from "../../services/parametreService";
import type { Abonnement } from "../../types/abonemment";

type Periode = "jour" | "semaine" | "mois" | "tout";

const PERIODES: { valeur: Periode; libelle: string }[] = [
  { valeur: "jour", libelle: "Aujourd'hui" },
  { valeur: "semaine", libelle: "Cette semaine" },
  { valeur: "mois", libelle: "Ce mois" },
  { valeur: "tout", libelle: "Tout" },
];

/** Convertit « 35 000 » ou « 4 000 Ar » en nombre. */
function parseMontant(prix?: string): number {
  if (!prix) return 0;
  const valeur = Number(String(prix).replace(/[^\d.-]/g, ""));
  return Number.isFinite(valeur) ? valeur : 0;
}

/** Accepte aussi bien « 01/11/2026 » que « 2026-11-01 ». */
function parseDate(date?: string): Date | null {
  if (!date) return null;

  const fr = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date.trim());
  if (fr) {
    const [, jour, mois, annee] = fr;
    const valeur = new Date(Number(annee), Number(mois) - 1, Number(jour));
    return Number.isNaN(valeur.getTime()) ? null : valeur;
  }

  const valeur = new Date(date);
  return Number.isNaN(valeur.getTime()) ? null : valeur;
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
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
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
        const data = await abonnementService.list();
        if (!ignore) setAbonnements(data);
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
      abonnements
        .map((abonnement) => ({
          ...abonnement,
          datePaiement: parseDate(abonnement.dateDebut) ?? parseDate(abonnement.created_at ?? undefined),
          montant: parseMontant(abonnement.prix),
        }))
        .sort((a, b) => (b.datePaiement?.getTime() ?? 0) - (a.datePaiement?.getTime() ?? 0)),
    [abonnements]
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
      return `${item.client ?? ""} ${item.numero_abonnement ?? ""} ${item.offre ?? ""}`
        .toLowerCase()
        .includes(terme);
    });
  }, [encaissements, periode, reference, recherche]);

  const totalFiltre = filtres.reduce((somme, item) => somme + item.montant, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />

      <div className="min-w-0 flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">CAISSE</h1>
          <p className="text-sm text-slate-500">Encaissements des abonnements</p>

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
                  <p className="mt-1 text-xs text-slate-400">{encaissements.length} abonnements</p>
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

                <div className="flex flex-wrap gap-2">
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
                          {item.numero_abonnement || `#${item.id}`}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.offre || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-800">
                          {formatMontant(item.montant, devise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {filtres.length > 0 && (
                    <tfoot className="border-t border-gray-100 bg-slate-50">
                      <tr>
                        <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500" colSpan={4}>
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
