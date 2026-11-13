import { TrendingUp, Users } from "lucide-react";

type Props = {
  totalClients?: number;
  chiffreAffaire?: number;
};

export function Card({ totalClients = 0, chiffreAffaire = 0 }: Props) {
  const formatNumber = (num: number) => num.toLocaleString("fr-FR");

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="w-126 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">CHIFFRE D&apos;AFFAIRE ANNUELLE</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-800">
              {formatNumber(chiffreAffaire)} Ar
            </h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="w-126 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">TOTAL DE CLIENTS</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-800">{formatNumber(totalClients)}</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Users size={24} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
