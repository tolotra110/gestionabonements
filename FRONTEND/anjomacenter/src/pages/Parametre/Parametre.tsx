import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import { parametreService } from "../../services/parametreService";
import type { Parametres } from "../../types/Parametres";

type Formulaire = Omit<Parametres, "id" | "updated_at">;

const VIDE: Formulaire = {
  nom_zone: "",
  adresse: "",
  telephone: "",
  email: "",
  devise: "Ar",
  duree_abonnement_jours: 30,
};

const champ =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

const libelle = "mb-1.5 block text-sm font-medium text-slate-600";

export default function Parametre() {
  const [form, setForm] = useState<Formulaire>(VIDE);
  const [initial, setInitial] = useState<Formulaire>(VIDE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [majLe, setMajLe] = useState<string | null>(null);

  const charger = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parametreService.get();
      const valeurs: Formulaire = {
        nom_zone: data.nom_zone ?? "",
        adresse: data.adresse ?? "",
        telephone: data.telephone ?? "",
        email: data.email ?? "",
        devise: data.devise ?? "Ar",
        duree_abonnement_jours: Number(data.duree_abonnement_jours) || 30,
      };
      setForm(valeurs);
      setInitial(valeurs);
      setMajLe(data.updated_at ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement des paramètres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const modifier = (champModifie: keyof Formulaire, valeur: string | number) => {
    setSucces(null);
    setForm((precedent) => ({ ...precedent, [champModifie]: valeur }));
  };

  const enregistrer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSucces(null);

    if (!form.nom_zone.trim()) {
      setError("Le nom de la zone est obligatoire");
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("L'adresse email n'est pas valide");
      return;
    }
    const duree = Number(form.duree_abonnement_jours);
    if (!Number.isInteger(duree) || duree < 1 || duree > 3650) {
      setError("La durée doit être un nombre entier de jours entre 1 et 3650");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const data = await parametreService.update({
        ...form,
        nom_zone: form.nom_zone.trim(),
        adresse: form.adresse.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim(),
        devise: form.devise.trim() || "Ar",
        duree_abonnement_jours: duree,
      });
      setMajLe(data.updated_at ?? null);
      setInitial(form);
      setSucces("Paramètres enregistrés");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const modifie = JSON.stringify(form) !== JSON.stringify(initial);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />

      <div className="min-w-0 flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">PARAMETRE</h1>
          <p className="text-sm text-slate-500">
            Configuration de la zone et des abonnements
            {majLe && (
              <span className="ml-2 text-slate-400">
                · dernière modification le {new Date(majLe).toLocaleString("fr-FR")}
              </span>
            )}
          </p>

          {loading && (
            <div className="mt-6 flex items-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement des paramètres...
            </div>
          )}

          {!loading && (
            <form
              onSubmit={enregistrer}
              className="mt-6 max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={libelle} htmlFor="nom_zone">
                    Nom de la zone
                  </label>
                  <input
                    id="nom_zone"
                    className={champ}
                    value={form.nom_zone}
                    onChange={(e) => modifier("nom_zone", e.target.value)}
                    placeholder="ANJOMA WIFI ZONE"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={libelle} htmlFor="adresse">
                    Adresse
                  </label>
                  <input
                    id="adresse"
                    className={champ}
                    value={form.adresse}
                    onChange={(e) => modifier("adresse", e.target.value)}
                    placeholder="Lot II B 45, Antananarivo"
                  />
                </div>

                <div>
                  <label className={libelle} htmlFor="telephone">
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    className={champ}
                    value={form.telephone}
                    onChange={(e) => modifier("telephone", e.target.value)}
                    placeholder="034 00 000 00"
                  />
                </div>

                <div>
                  <label className={libelle} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={champ}
                    value={form.email}
                    onChange={(e) => modifier("email", e.target.value)}
                    placeholder="anjomawifi@gmail.com"
                  />
                </div>

                <div>
                  <label className={libelle} htmlFor="devise">
                    Devise
                  </label>
                  <input
                    id="devise"
                    className={champ}
                    value={form.devise}
                    onChange={(e) => modifier("devise", e.target.value)}
                    placeholder="Ar"
                  />
                </div>

                <div>
                  <label className={libelle} htmlFor="duree">
                    Durée d&apos;un abonnement (jours)
                  </label>
                  <input
                    id="duree"
                    type="number"
                    min={1}
                    max={3650}
                    className={champ}
                    value={form.duree_abonnement_jours}
                    onChange={(e) => modifier("duree_abonnement_jours", Number(e.target.value))}
                  />
                </div>
              </div>

              {error && (
                <p className="mt-5 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
              )}
              {succes && (
                <p className="mt-5 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {succes}
                </p>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm(initial);
                    setError(null);
                    setSucces(null);
                  }}
                  disabled={!modifie || saving}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={16} />
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={!modifie || saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
