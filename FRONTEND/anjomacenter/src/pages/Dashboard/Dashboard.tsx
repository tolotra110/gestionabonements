import { useEffect, useMemo, useState } from "react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import { Card } from "../../components/Card/Card";
import OffreBarChart from "../Chart/OffreBarChart";
import AbonnementChart from "../Chart/Abonnementchart";
import { clientService } from "../../services/clientService";
import { abonnementService } from "../../services/abonnementService";
import type { Client } from "../../types/Client";
import type { Abonnement } from "../../types/abonemment";

function parsePrix(value: string | undefined): number {
  if (!value) return 0;
  const n = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [c, a] = await Promise.all([clientService.list(), abonnementService.list()]);
        if (!mounted) return;
        setClients(c);
        setAbonnements(a);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const chiffreAffaire = useMemo(
    () => abonnements.reduce((sum, a) => sum + parsePrix(a.prix), 0),
    [abonnements]
  );

  return (
    <div className="flex overflow-hidden">
      <Sidebare />
      <div className="min-w-0 flex-1">
        <Navbar />
        <div className="p-6">
          <h1 className="ml-3 mb-2 text-2xl font-bold text-gray-800">Dashboard</h1>
          {loading && <p className="ml-3 text-sm text-slate-500">Chargement des données...</p>}
          {error && <p className="ml-3 text-sm text-red-600">{error}</p>}

          <div className="ml-2 mt-4">
            <Card totalClients={clients.length} chiffreAffaire={chiffreAffaire} />
          </div>

          <div className="mt-2 flex  gap-12">
            <OffreBarChart abonnements={abonnements} />
            <AbonnementChart abonnements={abonnements} />
          </div>
        </div>
      </div>
    </div>
  );
}
