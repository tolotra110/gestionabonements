import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2, Printer } from "lucide-react";
import CarteAbonnement from "../../components/cart/CarteAbonnement";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import { abonnementService } from "../../services/abonnementService";
import type { Abonnement } from "../../types/abonemment";

function formaterDate(date?: string): string {
  if (!date) return "";
  const valeur = new Date(`${date}T00:00:00`);
  if (Number.isNaN(valeur.getTime())) return date;
  return valeur.toLocaleDateString("fr-FR");
}

function formaterPeriode(dateDebut?: string, dateFin?: string): string {
  const debut = formaterDate(dateDebut);
  const fin = formaterDate(dateFin);
  if (debut && fin) return `${debut} au ${fin}`;
  return debut || fin;
}

export default function Cartes() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const imprimerAutomatiquement = searchParams.get("imprimer") === "1";
  const impressionLancee = useRef<string | null>(null);
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Sans identifiant : on propose la liste des abonnés pour choisir une carte
        if (!id) {
          const data = await abonnementService.list();
          if (!ignore) setAbonnements(data);
          return;
        }

        const data = await abonnementService.get(Number(id));
        if (!ignore) setAbonnement(data);
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

  useEffect(() => {
    if (
      !imprimerAutomatiquement ||
      !id ||
      loading ||
      error ||
      !abonnement ||
      impressionLancee.current === id
    ) {
      return;
    }

    impressionLancee.current = id;
    window.setTimeout(() => window.print(), 100);
  }, [abonnement, error, id, imprimerAutomatiquement, loading]);

  return (
    <div className="flex">
      <Sidebare />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                to="/abonnement"
                className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
              >
                <ArrowLeft size={16} />
                Retour aux abonnements
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Carte d&apos;abonné</h1>
              <p className="text-sm text-slate-500">
                {id
                  ? abonnement
                    ? `Carte de ${abonnement.client}`
                    : "Chargement de la carte..."
                  : "Choisissez un abonné pour générer sa carte"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              disabled={!abonnement}
              className="no-print flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 p-6 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          )}

          {!loading && error && <div className="p-6 text-red-600">{error}</div>}

          {!loading && !error && id && abonnement && (
            <CarteAbonnement
              nom={abonnement.client}
              numeroAbonne={abonnement.numero_abonnement || `#${abonnement.id}`}
              validite={formaterPeriode(abonnement.dateDebut, abonnement.dateFin)}
            />
          )}

          {!loading && !error && !id && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {abonnements.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{item.client}</p>
                      <p className="text-sm text-slate-500">
                        {item.numero_abonnement || `#${item.id}`}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.statut === "ACTIF"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500">
                    Valide du {formaterPeriode(item.dateDebut, item.dateFin)}
                  </p>

                  <Link
                    to={`/carte/${item.id}`}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4" />
                    Générer la carte
                  </Link>
                </div>
              ))}

              {abonnements.length === 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-slate-500 shadow-sm sm:col-span-2 xl:col-span-3">
                  Aucun abonnement enregistré.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
