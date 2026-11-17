import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  Wallet,
  Wifi,
  CreditCard,
  Settings,
  PersonStanding,
  LogOutIcon,
} from "lucide-react";
import logo from "../../assets/images/anjoma.jpg";
import { useAuth } from "../../contexts/auth";

const listitem = [
  { id: 1, icone: LayoutDashboardIcon, libelle: "Dashboard", chemin: "/dashboard" },
  { id: 2, icone: PersonStanding, libelle: "Client", chemin: "/client" },
  { id: 3, icone: Wifi, libelle: "Abonnement", chemin: "/abonnement" },
  { id: 4, icone: Wallet, libelle: "Caisse", chemin: "/caisse" },
  { id: 5, icone: CreditCard, libelle: "Carte", chemin: "/carte" },
  { id: 6, icone: Settings, libelle: "Parametre", chemin: "/parametre" },
];

export function Sidebare() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Impossible de fermer la session.");
    }
  };

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 self-start flex-col gap-12 bg-slate-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      <div className="flex h-20 items-center gap-3 border-b border-slate-700 px-5">
        <img
          src={logo}
          alt="Logo ANJOMA"
          className="h-14 w-14 rounded-2xl object-cover shadow-lg"
        />

        <div>
          <h1 className="text-sm font-bold">ANJOMA WIFI</h1>
          <p className="text-xs text-slate-400">Zone Center</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-2 pb-4">
        {listitem.map((item) => (
          <NavLink
            key={item.id}
            to={item.chemin}
            className={({ isActive }) =>
              `flex h-12 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icone className="h-5 w-5 shrink-0" />
            <span>{item.libelle}</span>
          </NavLink>
        ))}

        {logoutError && <p role="alert" className="px-3 text-xs text-rose-300">{logoutError}</p>}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-auto flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-blue-700"
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          Deconnexion
        </button>
      </nav>
    </aside>
  );
}
