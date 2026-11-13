import { useEffect, useState } from "react";
import { Sidebare } from "../Sidebar/Sidebare";
import Navbar from "../Navbar/Navbar";
import { Calendar, CheckCircle, MessageSquare, Save, User, Wifi } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { abonnementService } from "../../services/abonnementService";

export default function Abonnementform() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [numeroAbonnement, setNumeroAbonnement] = useState("");
  const [client, setClient] = useState("");
  const [statut, setStatut] = useState("");
  const [observation, setObservation] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [offre, setOffre] = useState("");
  const [prix, setPrix] = useState("");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const a = await abonnementService.get(Number(id));
        if (!mounted) return;
        setNumeroAbonnement(a.numero_abonnement ?? "");
        setClient(a.client ?? "");
        setStatut(a.statut ?? "");
        setObservation(a.observation ?? "");
        setDateDebut(a.dateDebut ?? "");
        setDateFin(a.dateFin ?? "");
        setOffre(a.offre ?? "");
        setPrix(a.prix ?? "");
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  function navigateBack() {
    navigate("/abonnement");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload = {
        numero_abonnement: numeroAbonnement || null,
        client,
        statut,
        observation,
        dateDebut,
        dateFin,
        offre,
        prix,
      };
      if (isEdit && id) {
        await abonnementService.update(Number(id), payload);
      } else {
        await abonnementService.create(payload);
      }
      navigate("/abonnement");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex">
        <Sidebare />
        <div>
          <Navbar />
          <div className="min-h-screen pt-10">
            <form onSubmit={handleSubmit} className="mx-auto w-5/6 rounded-lg bg-white p-6 shadow-md">
              <h1 className="text-xl font-bold">
                {isEdit ? "Modifier l'abonnement" : "Information abonnement"}
              </h1>
              <p className="text-sm text-gray-600">
                {loading ? "Chargement..." : "Remplissez les informations de l'abonnement"}
              </p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

              <div className="mt-4 grid grid-cols-2 gap-10">
                <div>
                  <p>Numéro d&apos;abonnement</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <User size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={numeroAbonnement}
                      onChange={(e) => setNumeroAbonnement(e.target.value)}
                      placeholder="ex: ABN-001"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <p>Nom Client</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <User size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="Entrez le nom du client"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <p>Statut</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <CheckCircle size={26} className="text-blue-500" />
                    </div>
                    <select
                      value={statut}
                      onChange={(e) => setStatut(e.target.value)}
                      className="m-1 h-10 w-106 rounded-md border border-gray-200 bg-white pl-16 outline-none focus:border-blue-500"
                    >
                      <option value="">Choisir un statut</option>
                      <option value="ACTIF">Actif</option>
                      <option value="EXPIRÉ">Expiré</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p>Observation</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-27 w-12 rounded-md bg-blue-50 p-2">
                      <MessageSquare size={26} className="text-blue-500" />
                    </div>
                    <textarea
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      placeholder="Entrez l'observation"
                      className="m-1 h-27 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <p>Date de début</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Calendar size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      placeholder="ex: 01/09/2026"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <p>Date de fin</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Calendar size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      placeholder="ex: 01/10/2026"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <p>Offre</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Wifi size={26} className="text-blue-500" />
                    </div>
                    <select
                      value={offre}
                      onChange={(e) => setOffre(e.target.value)}
                      className="m-1 h-10 w-112 rounded-md border border-gray-200 bg-white pl-16 outline-none focus:border-blue-500"
                    >
                      <option value="">Choisir une offre</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 4">Option 4</option>
                      <option value="Option 5">Option 5</option>
                      <option value="Offre horaire">Offre horaire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p>Prix</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Wifi size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={prix}
                      onChange={(e) => setPrix(e.target.value)}
                      placeholder="ex: 15 000"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-3">
                <button type="button" onClick={navigateBack} className="w-45 rounded-lg bg-gray-100">
                  Annuler
                </button>
                <div className="relative flex">
                  <Save size={25} className="absolute left-6 top-1 text-white" />
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="h-10 w-45 rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none disabled:opacity-60"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}