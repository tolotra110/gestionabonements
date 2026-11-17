import {
  Eye,
  Pencil,
  Phone,
  HomeIcon,
  CreditCard,
  X,
  Trash2,
  MessageSquare,
} from "lucide-react";

import { type ClientCardProps } from "../../types/Client";
import { useState } from "react";

export default function ClientCard({
  client,
  onView,
  onEdit,
  onDelete,
}: ClientCardProps) {
  const [showObservation, setShowObservation] = useState(false);

  const getInitials = (nom: string) => {
    return nom
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-cyan-500",
    ];

    const index = client.nom.length % colors.length;

    return colors[index];
  };

  return (
    <>
      {/* CARTE CLIENT */}
      <div className="mx-auto w-full max-w-sm shrink-0 rounded-xl bg-white shadow-sm ring-1 ring-gray-100/60 transition-all hover:shadow-md">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor()}`}
            >
              {getInitials(client.nom)}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {client.nom}
              </h3>

              <p className="text-xs text-gray-400">
                {client.id}
              </p>
            </div>

          </div>
        </div>

        {/* INFORMATIONS */}
        <div className="space-y-1 px-4 pt-1 pb-3">

          <p className="flex gap-1 text-xs text-gray-500">
            <CreditCard
              size={15}
              className="text-gray-400"
            />
            {client.abonnement || "Abonnement non renseigné"}
          </p>

          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone
              size={13}
              className="text-gray-400"
            />
            {client.telephone || "Téléphone non renseigné"}
          </p>

          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <HomeIcon
              size={13}
              className="text-gray-400"
            />
            {client.Adresse || "Adresse non renseignée"}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-1 border-t border-gray-100 px-3 py-2">

          {/* VOIR */}
          <button
            type="button"
            onClick={() => onView?.(client)}
            title="Voir le client"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye size={15} />
          </button>

          {/* MODIFIER */}
          <button
            type="button"
            onClick={() => onEdit?.(client)}
            title="Modifier"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Pencil size={15} />
          </button>

          {/* OBSERVATION */}
          <button
            type="button"
            onClick={() => setShowObservation(true)}
            title="Observation"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <MessageSquare size={15} />
          </button>

          {/* SUPPRIMER */}
          <button
            type="button"
            onClick={() => onDelete?.(client)}
            title="Supprimer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>

        </div>
      </div>

      {/* POPUP OBSERVATION */}
      {showObservation && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowObservation(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor()}`}
                >
                  {getInitials(client.nom)}
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Observation
                  </h2>

                  <p className="text-xs text-gray-400">
                    {client.nom} · {client.id}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setShowObservation(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>

            </div>

            {/* OBSERVATION */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4">

              <div className="mb-3 flex items-center gap-2">

                <MessageSquare
                  size={18}
                  className="text-blue-500"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Observation du client
                </span>

              </div>

              <p className="text-sm leading-6 text-gray-600">
                {client.observation || "Aucune observation"}
              </p>

            </div>

            {/* FERMER */}
            <button
              type="button"
              onClick={() => setShowObservation(false)}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Fermer
            </button>

          </div>
        </div>
      )}
    </>
  );
}