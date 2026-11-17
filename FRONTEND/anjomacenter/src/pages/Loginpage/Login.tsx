import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import login from "../../assets/images/login.png";
import logo from "../../assets/images/anjoma.jpg";
import { useAuth } from "../../contexts/auth";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: authenticate, loading, user, sessionError } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [loading, navigate, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await authenticate(email, password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connexion impossible");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center">
      <img
        src={login}
        alt="WiFi Zone Center"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-slate-900/50" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src={logo} alt="Logo ANJOMA" className="h-14 w-14 rounded-xl object-cover shadow" />
          <div className="text-center">
            <h1 className="text-xl font-bold text-blue-600">ANJOMA</h1>
            <p className="text-xs font-medium text-slate-600">WiFi Zone Center</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Connexion</h2>
          <p className="mt-1 text-slate-600">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {(error || sessionError) && (
            <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error || sessionError}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
              Adresse e-mail
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-11 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
              Mot de passe
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Accès réservé aux comptes autorisés.
        </p>
      </div>
    </div>
  );
}
