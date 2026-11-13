import { useEffect, useMemo, useState } from "react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import AbonnementCard from "../../components/Abonnements/AbonnementCard";
import { Clock, Plus, Search, Wifi, Download } from "lucide-react";
import Abonnementtable from "../../components/Abonnements/Abonnementtable";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import type { Abonnement } from "../../types/abonemment";
import { abonnementService } from "../../services/abonnementService";

export default function Abonnement() {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setAbonnements(await abonnementService.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return abonnements.filter((a) =>
      `${a.numero_abonnement ?? ""} ${a.client ?? ""} ${a.offre ?? ""} ${a.statut ?? ""}`.toLowerCase().includes(q)
    );
  }, [abonnements, search]);

  const stats = useMemo(() => {
    const actifs = abonnements.filter((a) => (a.statut ?? "").toUpperCase() === "ACTIF").length;
    const expires = abonnements.filter((a) => (a.statut ?? "").toUpperCase() === "EXPIRÉ" || (a.statut ?? "").toUpperCase() === "EXPIRE").length;
    return { actifs, expires };
  }, [abonnements]);

  const handleExportExcel = () => {
    const rows = [
      ["N° Abonnement", "Client", "Offre", "Prix", "Date début", "Date fin", "Observation", "Statut"],
      ...filtered.map((a) => [
        a.numero_abonnement ?? "",
        a.client ?? "",
        a.offre ?? "",
        a.prix ?? "",
        a.dateDebut ?? "",
        a.dateFin ?? "",
        a.observation ?? "",
        a.statut ?? "",
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 14 }, { wch: 14 }, { wch: 25 }, { wch: 12 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Abonnements");
    XLSX.writeFile(workbook, "abonnements.xlsx");
  };

  const handleDelete = async (a: Abonnement) => {
    if (!window.confirm(`Supprimer l'abonnement de "${a.client}" ?`)) return;
    try {
      await abonnementService.remove(a.id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <div className="flex">
        <Sidebare />
        <div>
          <Navbar />
          <div className="p-4">
            <h1 className="text-2xl font-bold">ABONNEMENT</h1>
            <p className="text-sm text-slate-500">Gestion abonnements</p>
          </div>
          <div className="flex gap-4 pb-4 pl-6">
            <AbonnementCard
              title="Abonnements actifs"
              value={String(stats.actifs)}
              description="Abonnements actuellement actifs"
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Wifi className="text-green-600" size={24} />
                </div>
              }
            />
            <AbonnementCard
              title="Abonnements expirés"
              value={String(stats.expires)}
              description="Abonnements arrivés à expiration"
              icon={
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <Clock className="text-red-600" size={24} />
                </div>
              }
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative ml-6 flex gap-2">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un abonnement..."
                className="w-112 rounded-xl border border-gray-200 bg-white pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />

              <Link
                to="/abonnementform"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
              >
                <Plus size={20} />
                Nouvel abonnement
              </Link>

              <button
                type="button"
                onClick={handleExportExcel}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700 sm:w-auto"
              >
                <Download size={20} />
                Exporter Excel
              </button>
            </div>
          </div>

          <div>
            {loading && <div className="p-6 text-slate-500">Chargement...</div>}
            {error && <div className="p-6 text-red-600">{error}</div>}
            {!loading && !error && (
              <Abonnementtable items={filtered} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}