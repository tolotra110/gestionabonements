import { useEffect, useState, type FormEvent } from "react";
import { Sidebare } from "../Sidebar/Sidebare";
import Navbar from "../Navbar/Navbar";
import { Calendar, CheckCircle, MessageSquare, Save, User, Wifi } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { abonnementService } from "../../services/abonnementService";

const fieldClass =
  "h-10 w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const iconClass =
  "absolute left-0 top-0 flex h-10 w-12 items-center justify-center rounded-l-md bg-blue-50 text-blue-500";

function toDateInputValue(value?: string) {
  if (!value) return "";

  const normalized = value.trim();
  const iso = /^(\d{4}-\d{2}-\d{2})(?:$|T)/.exec(normalized);
  if (iso) return iso[1];

  const french = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalized);
  return french ? `${french[3]}-${french[2]}-${french[1]}` : "";
}

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
        const abonnement = await abonnementService.get(Number(id));
        if (!mounted) return;
        setNumeroAbonnement(abonnement.numero_abonnement ?? "");
        setClient(abonnement.client ?? "");
        setStatut(abonnement.statut ?? "");
        setObservation(abonnement.observation ?? "");
        setDateDebut(toDateInputValue(abonnement.dateDebut));
        setDateFin(toDateInputValue(abonnement.dateFin));
        setOffre(abonnement.offre ?? "");
        setPrix(abonnement.prix ?? "");
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

  function navigateBack() {
    navigate("/abonnement");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const payload = {
        numero_abonnement: numeroAbonnement || undefined,
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="p-4 sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-4xl rounded-lg bg-white p-4 shadow-md sm:p-6"
          >
            <h1 className="text-xl font-bold">
              {isEdit ? "Modifier l'abonnement" : "Information abonnement"}
            </h1>
            <p className="text-sm text-gray-600">
              {loading ? "Chargement..." : "Remplissez les informations de l'abonnement"}
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="numero-abonnement">
                  Numéro d&apos;abonnement
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <User size={22} aria-hidden="true" />
                  </span>
                  <input
                    id="numero-abonnement"
                    type="text"
                    value={numeroAbonnement}
                    onChange={(e) => setNumeroAbonnement(e.target.value)}
                    placeholder="ex: ABN-001"
                    className={`${fieldClass} pl-14`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="client">
                  Nom Client
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <User size={22} aria-hidden="true" />
                  </span>
                  <input
                    id="client"
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Entrez le nom du client"
                    className={`${fieldClass} pl-14`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="statut">
                  Statut
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <CheckCircle size={22} aria-hidden="true" />
                  </span>
                  <select
                    id="statut"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className={`${fieldClass} appearance-none pl-14`}
                  >
                    <option value="">Choisir un statut</option>
                    <option value="ACTIF">Actif</option>
                    <option value="EXPIRÉ">Expiré</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="observation">
                  Observation
                </label>
                <div className="relative">
                  <span className={`${iconClass} h-10`}>
                    <MessageSquare size={22} aria-hidden="true" />
                  </span>
                  <textarea
                    id="observation"
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Entrez l'observation"
                    className="min-h-24 w-full resize-y rounded-md border border-gray-200 bg-white py-2 pl-14 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="date-debut">
                  Date de début
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <Calendar size={22} aria-hidden="true" />
                  </span>
                  <input
                    id="date-debut"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className={`${fieldClass} pl-14`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="date-fin">
                  Date de fin
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <Calendar size={22} aria-hidden="true" />
                  </span>
                  <input
                    id="date-fin"
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className={`${fieldClass} pl-14`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="offre">
                  Offre
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <Wifi size={22} aria-hidden="true" />
                  </span>
                  <select
                    id="offre"
                    value={offre}
                    onChange={(e) => setOffre(e.target.value)}
                    className={`${fieldClass} appearance-none pl-14`}
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
                <label className="mb-1 block text-sm font-medium" htmlFor="prix">
                  Prix
                </label>
                <div className="relative">
                  <span className={iconClass}>
                    <Wifi size={22} aria-hidden="true" />
                  </span>
                  <input
                    id="prix"
                    type="text"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    placeholder="ex: 15 000"
                    className={`${fieldClass} pl-14`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={navigateBack}
                className="h-10 rounded-lg bg-blue-50 px-5 text-sm font-medium text-blue-700 hover:bg-blue-100 sm:w-40"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving || loading}
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white hover:bg-blue-700 focus:outline-none disabled:opacity-60 sm:w-40"
              >
                <Save size={18} aria-hidden="true" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
