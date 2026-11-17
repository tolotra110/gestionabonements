import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Clock, Download, Plus, Search, Wifi } from "lucide-react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import AbonnementCard from "../../components/Abonnements/AbonnementCard";
import Abonnementtable from "../../components/Abonnements/Abonnementtable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { Abonnement } from "../../types/abonemment";
import { abonnementService } from "../../services/abonnementService";

export default function Abonnement() {
  const navigate = useNavigate();
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
    return abonnements.filter((abonnement) =>
      `${abonnement.numero_abonnement ?? ""} ${abonnement.client ?? ""} ${abonnement.offre ?? ""} ${abonnement.statut ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [abonnements, search]);

  const stats = useMemo(() => {
    const actifs = abonnements.filter((abonnement) => (abonnement.statut ?? "").toUpperCase() === "ACTIF").length;
    const expires = abonnements.filter((abonnement) => {
      const statut = (abonnement.statut ?? "").toUpperCase();
      return statut === "EXPIRÉ" || statut === "EXPIRE";
    }).length;
    return { actifs, expires };
  }, [abonnements]);

  const handleExportExcel = () => {
    const rows = [
      ["N° Abonnement", "Client", "Offre", "Prix", "Date début", "Date fin", "Observation", "Statut"],
      ...filtered.map((abonnement) => [
        abonnement.numero_abonnement ?? "",
        abonnement.client ?? "",
        abonnement.offre ?? "",
        abonnement.prix ?? "",
        abonnement.dateDebut ?? "",
        abonnement.dateFin ?? "",
        abonnement.observation ?? "",
        abonnement.statut ?? "",
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 25 },
      { wch: 12 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Abonnements");
    XLSX.writeFile(workbook, "abonnements.xlsx");
  };

  const handleDelete = async (abonnement: Abonnement) => {
    try {
      await abonnementService.remove(abonnement.id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebare />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="space-y-5 p-4 sm:p-6">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Abonnements</h1>
            <p className="text-sm text-muted-foreground">Suivez les offres et les périodes d&apos;abonnement.</p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2" aria-label="Statistiques des abonnements">
            <AbonnementCard
              title="Abonnements actifs"
              value={String(stats.actifs)}
              description="Abonnements actuellement actifs"
              icon={<Wifi size={18} />}
            />
            <AbonnementCard
              title="Abonnements expirés"
              value={String(stats.expires)}
              description="Abonnements arrivés à expiration"
              icon={<Clock size={18} />}
            />
          </section>

          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un abonnement..."
                aria-label="Rechercher un abonnement"
                className="h-9 pl-9"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={() => navigate("/abonnementform")}
                className="h-9"
              >
                <Plus />
                Nouvel abonnement
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleExportExcel}
                className="h-9"
              >
                <Download />
                Exporter Excel
              </Button>
            </div>
          </section>

          {loading && <p className="py-6 text-sm text-muted-foreground">Chargement des abonnements...</p>}
          {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
          {!loading && !error && (
            <Abonnementtable items={filtered} onDelete={handleDelete} onPaymentChange={load} />
          )}
        </main>
      </div>
    </div>
  );
}
