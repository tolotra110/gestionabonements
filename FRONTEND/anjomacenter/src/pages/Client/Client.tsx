import { useEffect, useState } from "react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import ClientCard from "../../components/Clientcard/Clientcard";
import { type Client } from "../../types/Client";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { clientService } from "../../services/clientService";

export function Client() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const clientsPerPage = 6;

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.list();
      setClients(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  const handleDelete = async (client: Client) => {
    const confirmation = window.confirm(
      `Voulez-vous supprimer le client "${client.nom}" ?`
    );
    if (!confirmation) return;
    try {
      await clientService.remove(client.id);
      await loadClients();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression");
    }
  };

  function Ajouterclient() {
    navigate("/clientform");
  }

  const handleView = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEdit = (client: Client) => {
    navigate(`/clientform/${client.id}`);
  };

  const filtered = clients.filter((c) =>
    `${c.nom ?? ""} ${c.telephone ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / clientsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastClient = safePage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filtered.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />

      <div className="flex-1">
        <Navbar />

        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-800">CLIENT</h1>
            <p className="text-sm text-slate-500">Gestion des clients</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Rechercher un client"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="ml-2 w-[295px] rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />

            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                <FileSpreadsheet size={20} />
                Export Excel
              </button>

              <button
                onClick={Ajouterclient}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <PlusCircle size={20} />
                Nouvel client
              </button>
            </div>
          </div>

          {loading && <div className="mt-6 text-slate-500">Chargement...</div>}
          {error && <div className="mt-6 text-red-600">{error}</div>}

          {!loading && !error && (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {currentClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="mt-10 text-center text-slate-500">
                  Aucun client trouvé.
                </div>
              )}
            </>
          )}
        </div>

        {totalPages > 1 && !loading && !error && (
          <div className="mt-6 flex items-center justify-center gap-2 pb-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Précédent
            </button>

            <span className="px-3 py-2 text-sm">
              Page {safePage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Informations du client
                </h2>
                <p className="text-sm text-slate-500">{selectedClient.id}</p>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400">NOM</p>
                <p className="font-semibold text-slate-800">
                  {selectedClient.nom}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">TÉLÉPHONE</p>
                <p className="text-slate-700">{selectedClient.telephone}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">ADRESSE</p>
                <p className="text-slate-700">{selectedClient.Adresse}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">ABONNEMENT</p>
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                  {selectedClient.abonnement}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">OBSERVATION</p>
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  {selectedClient.observation}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}