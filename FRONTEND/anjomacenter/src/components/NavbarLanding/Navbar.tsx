import { Link} from "react-router-dom";
import { User } from "lucide-react";
import logo from "../../assets/images/anjoma.jpg";

export function Navbar  () {



  return (
    <header className="w-full border-b border-gray-100 bg-white shadow-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
   
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Logo ANJOMA"
            className="h-14 w-14 rounded-full object-contain shadow"
          />

          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight text-blue-600">
              ANJOMA
            </h1>

            <p className="text-xs font-medium text-slate-700">
              WiFi Zone Center
            </p>
          </div>
        </Link>

        <Link
          to="/login"
          className="hidden items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md md:flex"
        >
          <User className="h-5 w-5" />
          Se connecter
        </Link>
      </nav>
    </header>
  );
};
