import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Landing/Landing"
import {Login} from "./pages/Loginpage/Login"
import Carte from "./pages/Carte/Carte"
import {Client} from "./pages/Client/Client"
import Clientform from "./components/ClientForm/Clientform"
import Abonnement from "./pages/Abonnement/Abonnement"
import Abonnementform from "./components/Abonnements/Abonnementform"
import Dashboard from "./pages/Dashboard/Dashboard"
import Caisse from "./pages/Caisse/Caisse"
import Parametre from "./pages/Parametre/Parametre"
import Recu from "./pages/Recu/Recu"
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/auth";

function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Vérification de la session...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="/carte/:id" element={<Carte />} />
            <Route path="/client" element={<Client />} />
            <Route path="/clientform" element={<Clientform />} />
            <Route path="/clientform/:id" element={<Clientform />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/abonnementform" element={<Abonnementform />} />
            <Route path="/abonnementform/:id" element={<Abonnementform />} />
            <Route path="/caisse" element={<Caisse />} />
            <Route path="/parametre" element={<Parametre />} />
            <Route path="/recu/:id" element={<Recu />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
