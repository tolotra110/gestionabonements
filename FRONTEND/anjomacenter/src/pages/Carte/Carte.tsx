import CarteAbonnement from "../../components/cart/CarteAbonnement";
import { Printer } from "lucide-react";

export default function Cartes() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Génération de cartes
        </h1>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </button>
      </div>

      <CarteAbonnement
        offre="1 JOUR"
        prix="1 000 Ar"
        duree="24 heures"
        code="AWZ-48291"
      />
    </div>
  );
}
