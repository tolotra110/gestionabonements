import { useState } from "react";
import { Mail, Lock, User, UserCircle, Eye, EyeOff, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import login from "../../assets/images/login.png";

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register attempt:", { name, email, password, profile });
    navigate("/client");
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${login})` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-slate-900/50" />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
        <div className="mb-2 flex flex-col items-center gap-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold text-blue-600">ANJOMA</h1>
            <p className="text-xs font-medium text-slate-600">WiFi Zone Center</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900">Créer un compte</h2>
        <p className="mt-1 text-xs text-slate-600">Inscrivez-vous pour accéder à votre espace client</p>

        <form onSubmit={handleSubmit} className="mt-2 space-y-2">
          <div className="flex flex-col items-center gap-1">
            <label
              htmlFor="profile-image"
              className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-blue-600 hover:text-blue-600"
            >
              {profile ? (
                <img src={profile} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                <UserCircle className="h-8 w-8" />
              )}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImage}
              />
              <span className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-3 w-3" />
              </span>
            </label>
            <span className="text-xs text-slate-500">Cliquez pour ajouter votre photo</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Nom complet</label>
              <div className="relative mt-1">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Adresse e-mail</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Mot de passe</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700">Confirmer le mot de passe</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-1 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-2 text-center text-sm text-slate-600">
          Vous avez déjà un compte ?
          <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-700">
            {" "}
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
