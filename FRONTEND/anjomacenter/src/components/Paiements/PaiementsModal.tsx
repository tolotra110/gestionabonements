import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { paiementService } from "../../services/paiementService";
import { METHODES_PAIEMENT, type Paiement } from "../../types/Paiement";
import type { Abonnement } from "../../types/abonemment";

const parseMontant = (valeur?: string | number): number => {
  if (valeur === undefined || valeur === null) return 0;
  const nombre = Number(String(valeur).replace(/[^\d.-]/g, ""));
  return Number.isFinite(nombre) ? nombre : 0;
};

const formatMontant = (valeur: number, devise: string) =>
  `${valeur.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} ${devise}`;

const dateDuJour = () => {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
};

const formatDate = (valeur?: string) => {
  if (!valeur) return "—";
  const [annee, mois, jour] = valeur.slice(0, 10).split("-");
  return jour && mois && annee ? `${jour}/${mois}/${annee}` : valeur;
};

export default function PaiementsModal({
  abonnement,
  devise = "Ar",
  onClose,
  onChanged,
}: {
  abonnement: Abonnement;
  devise?: string;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [montant, setMontant] = useState("");
  const [datePaiement, setDatePaiement] = useState(dateDuJour);
  const [methode, setMethode] = useState<string>(METHODES_PAIEMENT[0]);
  const [note, setNote] = useState("");

  const prix = parseMontant(abonnement.prix);
  const paye = useMemo(
    () => paiements.reduce((somme, p) => somme + parseMontant(p.montant), 0),
    [paiements]
  );
  const reste = Math.max(0, prix - paye);

  const charger = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paiementService.listByAbonnement(abonnement.id);
      setPaiements(data);
      const dejaPaye = data.reduce((somme, p) => somme + parseMontant(p.montant), 0);
      setMontant(String(Math.max(0, prix - dejaPaye)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement des paiements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abonnement.id]);

  const ajouter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valeur = Number(montant);

    if (!Number.isFinite(valeur) || valeur <= 0) {
      setError("Saisissez un montant supérieur à 0");
      return;
    }
    if (valeur > reste) {
      setError(`Le montant dépasse le reste à payer (${formatMontant(reste, devise)})`);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await paiementService.create({
        abonnement_id: abonnement.id,
        montant: valeur,
        date_paiement: datePaiement,
        methode,
        note: note.trim() || undefined,
      });
      setNote("");
      await charger();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const supprimer = async (paiement: Paiement) => {
    if (!window.confirm(`Supprimer le paiement de ${formatMontant(parseMontant(paiement.montant), devise)} ?`)) {
      return;
    }
    try {
      await paiementService.remove(paiement.id);
      await charger();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const champ =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Paiements</h2>
            <p className="text-sm text-slate-500">
              {abonnement.client} · {abonnement.numero_abonnement || `#${abonnement.id}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 text-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Prix</p>
              <p className="text-sm font-semibold text-slate-700">{formatMontant(prix, devise)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Payé</p>
              <p className="text-sm font-semibold text-emerald-600">{formatMontant(paye, devise)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Reste</p>
              <p className={`text-sm font-semibold ${reste > 0 ? "text-rose-600" : "text-slate-700"}`}>
                {formatMontant(reste, devise)}
              </p>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${prix > 0 ? Math.min(100, (paye / prix) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto px-6 pt-4">
          {loading && (
            <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          )}

          {!loading && paiements.length === 0 && (
            <p className="py-4 text-sm text-slate-500">Aucun versement enregistré.</p>
          )}

          {!loading && paiements.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {paiements.map((paiement) => (
                <li key={paiement.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700">
                      {formatMontant(parseMontant(paiement.montant), devise)}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {formatDate(paiement.date_paiement)} · {paiement.methode}
                      {paiement.note ? ` · ${paiement.note}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => supprimer(paiement)}
                    className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                    title="Supprimer ce paiement"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={ajouter} className="border-t border-gray-100 px-6 py-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">Enregistrer un versement</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="montant">
                Montant
              </label>
              <input
                id="montant"
                type="number"
                min={1}
                max={reste || undefined}
                step="any"
                className={champ}
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="date-paiement">
                Date
              </label>
              <input
                id="date-paiement"
                type="date"
                className={champ}
                value={datePaiement}
                onChange={(e) => setDatePaiement(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="methode">
                Méthode
              </label>
              <select
                id="methode"
                className={champ}
                value={methode}
                onChange={(e) => setMethode(e.target.value)}
              >
                {METHODES_PAIEMENT.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor="note">
                Note
              </label>
              <input
                id="note"
                className={champ}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optionnel"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving || reste === 0}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
