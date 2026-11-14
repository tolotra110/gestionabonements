import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Printer, Wifi } from "lucide-react";
import { paiementService } from "../../services/paiementService";
import { parametreService } from "../../services/parametreService";
import type { Paiement } from "../../types/Paiement";
import type { Parametres } from "../../types/Parametres";

const parseMontant = (valeur?: string | number): number => {
  if (valeur === undefined || valeur === null) return 0;
  const nombre = Number(String(valeur).replace(/[^\d.-]/g, ""));
  return Number.isFinite(nombre) ? nombre : 0;
};

const formatMontant = (valeur: number, devise: string) =>
  `${valeur.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} ${devise}`;

const formatDate = (valeur?: string) => {
  if (!valeur) return "—";
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(valeur);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return valeur;
};

export default function Recu() {
  const { id } = useParams();
  const [paiement, setPaiement] = useState<Paiement | null>(null);
  const [paiementsAbonnement, setPaiementsAbonnement] = useState<Paiement[]>([]);
  const [parametres, setParametres] = useState<Parametres | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await paiementService.get(Number(id));
        if (ignore) return;
        setPaiement(data);

        const [historique, config] = await Promise.all([
          paiementService.listByAbonnement(Number(data.abonnement_id)),
          parametreService.get().catch(() => null),
        ]);
        if (ignore) return;
        setPaiementsAbonnement(historique);
        setParametres(config);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  const devise = parametres?.devise || "Ar";
  const prix = parseMontant(paiement?.prix_abonnement);
  const totalVerse = paiementsAbonnement.reduce((somme, p) => somme + parseMontant(p.montant), 0);
  const reste = Math.max(0, prix - totalVerse);
  const montant = parseMontant(paiement?.montant);
  const annee = (paiement?.date_paiement || "").slice(0, 4) || String(new Date().getFullYear());

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="no-print mx-auto flex max-w-[820px] items-center justify-between px-6 py-5">
        <Link
          to="/caisse"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour à la caisse
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Printer size={16} />
          Imprimer le reçu
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement du reçu...
        </div>
      )}

      {!loading && error && (
        <p className="mx-auto max-w-[820px] px-6 py-16 text-center text-sm text-rose-600">{error}</p>
      )}

      {!loading && !error && paiement && (
        <div className="mx-auto max-w-[820px] px-6 pb-12">
          <div
            id="recu-a-imprimer"
            className="mx-auto w-full max-w-[700px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none"
          >
            <div className="flex items-start justify-between gap-6 border-b border-gray-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                  <Wifi className="text-white" size={26} />
                </div>
                <div>
                  <p className="text-lg font-bold leading-tight text-slate-900">
                    {parametres?.nom_zone || "ANJOMA WIFI ZONE"}
                  </p>
                  <p className="text-xs text-slate-500">Zone Center</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    {[parametres?.adresse, parametres?.telephone, parametres?.email]
                      .filter(Boolean)
                      .join(" · ") || "Antananarivo"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Reçu</p>
                <p className="text-sm font-bold text-slate-800">
                  REC-{annee}-{String(paiement.id).padStart(5, "0")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Date : {formatDate(paiement.date_paiement)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Reçu de
                </p>
                <p className="font-semibold text-slate-800">{paiement.client}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  N° abonnement
                </p>
                <p className="font-semibold text-slate-800">
                  {paiement.numero_abonnement || `#${paiement.abonnement_id}`}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Offre
                </p>
                <p className="text-slate-700">{paiement.offre || "—"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Période couverte
                </p>
                <p className="text-slate-700">
                  {formatDate(paiement.abonnement_debut)} → {formatDate(paiement.abonnement_fin)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700/70">
                  Montant versé
                </p>
                <p className="text-xs text-slate-500">
                  {paiement.methode || "—"}
                  {paiement.note ? ` · ${paiement.note}` : ""}
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatMontant(montant, devise)}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 px-4 py-3 text-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Prix de l&apos;abonnement
                </p>
                <p className="text-sm font-semibold text-slate-700">{formatMontant(prix, devise)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Total versé
                </p>
                <p className="text-sm font-semibold text-emerald-600">
                  {formatMontant(totalVerse, devise)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Reste à payer
                </p>
                <p
                  className={`text-sm font-semibold ${reste > 0 ? "text-rose-600" : "text-slate-700"}`}
                >
                  {formatMontant(reste, devise)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between gap-6 text-xs text-slate-500">
              <div>
                <p>Signature du client</p>
                <div className="mt-8 w-40 border-t border-dashed border-slate-300" />
              </div>
              <div className="text-right">
                <p>Pour {parametres?.nom_zone || "ANJOMA WIFI ZONE"}</p>
                <div className="mt-8 ml-auto w-40 border-t border-dashed border-slate-300" />
              </div>
            </div>

            <p className="mt-6 border-t border-gray-100 pt-3 text-center text-[10px] text-slate-400">
              Reçu généré automatiquement — à conserver comme preuve de paiement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
