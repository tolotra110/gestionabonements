import { useEffect, useState } from "react";
import { Sidebare } from "../Sidebar/Sidebare";
import Navbar from "../Navbar/Navbar";
import { Home, MessageSquare, Phone, Save, User, Wifi } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { clientService } from "../../services/clientService";

export default function Clientform() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [Adresse, setAdresse] = useState("");
  const [observation, setObservation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [abonnement, setAbonnement] = useState("");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const c = await clientService.get(id);
        if (!mounted) return;
        setNom(c.nom ?? "");
        setAdresse(c.Adresse ?? "");
        setObservation(c.observation ?? "");
        setTelephone(c.telephone ?? "");
        setAbonnement(c.abonnement ?? "");
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  function navigateclient() {
    navigate("/client");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload = { nom, Adresse, observation, telephone, abonnement };
      if (isEdit && id) {
        await clientService.update(id, payload);
      } else {
        await clientService.create(payload);
      }
      navigate("/client");
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
            <form
              onSubmit={handleSubmit}
              className="mx-auto h-full w-5/6 rounded-lg bg-white p-6 shadow-md"
            >
              <h1 className="text-xl font-bold">
                {isEdit ? "Modifier le client" : "Information client"}
              </h1>
              <p className="text-sm text-gray-600">
                {loading ? "Chargement..." : "Remplissez les informations du client"}
              </p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

              <div className="mt-4 grid grid-cols-2 gap-10">
                <div>
                  <p>Nom complet</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <User size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Entrez le nom complet"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <p>Adresse</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Home size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={Adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      placeholder="Entrez l'adresse"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
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
                  <p>Numéro de téléphone</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Phone size={26} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="Entrez le numéro de téléphone"
                      className="m-1 h-10 w-110 rounded-md border border-gray-100 pl-14 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <p>Abonnement</p>
                  <div className="relative flex">
                    <div className="absolute m-1 h-10 w-12 rounded-md bg-blue-50 p-2">
                      <Wifi size={26} className="text-blue-500" />
                    </div>
                    <select
                      value={abonnement}
                      onChange={(e) => setAbonnement(e.target.value)}
                      className="m-1 h-10 w-112 rounded-md border border-gray-200 bg-white pl-16 outline-none focus:border-blue-500"
                    >
                      <option value="">Choisir un abonnement</option>
                      <option value="Offre horaire">Offre horaire</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 4">Option 4</option>
                      <option value="Option 5">Option 5</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={navigateclient}
                  className="w-45 rounded-lg bg-gray-100"
                >
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
