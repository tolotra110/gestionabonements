import { Wallet } from "lucide-react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import PagePlaceholder from "../../components/Placeholder/PagePlaceholder";

export default function Caisse() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />
      <div className="min-w-0 flex-1">
        <Navbar />
        <PagePlaceholder
          titre="CAISSE"
          sousTitre="Encaissements et suivi de la journée"
          description="La caisse n'est pas encore disponible"
          icone={Wallet}
          points={[
            "Encaissement d'un abonnement et impression du reçu",
            "Total des entrées par jour, semaine et mois",
            "Historique des paiements avec filtre par opérateur",
          ]}
        />
      </div>
    </div>
  );
}
