import { Settings } from "lucide-react";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";

export default function Parametre() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">PARAMÈTRES</h1>
          <section className="mt-6 flex min-h-[16rem] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <Settings className="mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="font-semibold text-slate-700">Configuration en préparation</p>
            <p className="mt-1 text-sm text-slate-500">Cette page sera disponible prochainement.</p>
          </section>
        </main>
      </div>
    </div>
  );
}
