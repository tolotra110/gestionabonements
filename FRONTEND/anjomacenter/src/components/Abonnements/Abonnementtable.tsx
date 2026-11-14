import { useEffect, useMemo, useState } from "react";
import { CreditCard, Pencil, Trash2, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import PaiementsModal from "../Paiements/PaiementsModal";
import { type Abonnement } from "../../types/abonemment";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const parseMontant = (valeur?: string | number): number => {
  if (valeur === undefined || valeur === null) return 0;
  const nombre = Number(String(valeur).replace(/[^\d.-]/g, ""));
  return Number.isFinite(nombre) ? nombre : 0;
};

const formatMontant = (valeur: number) =>
  valeur.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ");

export default function AbonnementTable({
  items,
  onDelete,
  onPaymentChange,
}: {
  items: Abonnement[];
  onDelete: (a: Abonnement) => void;
  onPaymentChange?: () => void;
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [paiementDe, setPaiementDe] = useState<Abonnement | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentItems = useMemo(
    () => items.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [items, startIndex]
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="mt-6 flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-800">Liste des abonnements</h2>
        <p className="mt-1 text-sm text-gray-500">
          Consultez et gérez les abonnements des clients
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-500">
              <th className="px-4 py-4 font-medium">N° Abonnement</th>
              <th className="px-4 py-4 font-medium">Client</th>
              <th className="px-4 py-4 font-medium">Offre</th>
              <th className="px-4 py-4 font-medium">Prix</th>
              <th className="px-4 py-4 font-medium">Date début</th>
              <th className="px-4 py-4 font-medium">Date fin</th>
              <th className="px-4 py-4 font-medium">Observation</th>
              <th className="px-4 py-4 font-medium">Statut</th>
              <th className="px-4 py-4 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentItems.map((abonnement) => {
              const statut = (abonnement.statut ?? "").toUpperCase();
              const actif = statut === "ACTIF";
              return (
                <tr key={abonnement.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">{abonnement.numero_abonnement || `#${abonnement.id}`}</div>
                    <div className="text-xs text-gray-400">ID {abonnement.id}</div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800">{abonnement.client}</td>
                  <td className="px-4 py-4">
                    <span className="whitespace-nowrap rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                      {abonnement.offre}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="font-medium text-gray-800">{abonnement.prix}</div>
                    {parseMontant(abonnement.montant_paye) > 0 && (
                      <div className="text-xs text-gray-400">
                        Payé {formatMontant(parseMontant(abonnement.montant_paye))}
                        {" · "}Reste{" "}
                        {formatMontant(
                          Math.max(0, parseMontant(abonnement.prix) - parseMontant(abonnement.montant_paye))
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{abonnement.dateDebut}</td>
                  <td className="px-4 py-4 text-gray-600">{abonnement.dateFin}</td>
                  <td className="max-w-[200px] px-4 py-4 text-gray-500">
                    <span className="block truncate">{abonnement.observation}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                        actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${actif ? "bg-green-500" : "bg-red-500"}`} />
                      {abonnement.statut || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="Paiements"
                        onClick={() => setPaiementDe(abonnement)}
                        className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50"
                      >
                        <Wallet size={17} />
                      </button>
                      <button
                        type="button"
                        title="Générer la carte"
                        onClick={() => navigate(`/carte/${abonnement.id}`)}
                        className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                      >
                        <CreditCard size={17} />
                      </button>
                      <button
                        type="button"
                        title="Modifier"
                        onClick={() => navigate(`/abonnementform/${abonnement.id}`)}
                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        type="button"
                        title="Supprimer"
                        onClick={() => onDelete(abonnement)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                  Aucun abonnement.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-4">
        <p className="text-sm text-gray-500">
          Total : <span className="font-semibold text-gray-700">{items.length}</span> abonnements
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-2 text-sm text-gray-600">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {paiementDe && (
        <PaiementsModal
          abonnement={paiementDe}
          onClose={() => setPaiementDe(null)}
          onChanged={onPaymentChange}
        />
      )}
    </div>
  );
}