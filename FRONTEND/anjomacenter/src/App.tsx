import {Route,Routes} from  "react-router-dom"
import Home from "./pages/Landing/Landing"
import {Login} from "./pages/Loginpage/Login"
import {Register} from "./pages/Loginpage/Register"
import Carte from "./pages/Carte/Carte"
import {Client} from "./pages/Client/Client"
import Clientform from "./components/ClientForm/Clientform"
import Abonnement from "./pages/Abonnement/Abonnement"
import Abonnementform from "./components/Abonnements/Abonnementform"
import Dashboard from "./pages/Dashboard/Dashboard"
import Caisse from "./pages/Caisse/Caisse"
import Parametre from "./pages/Parametre/Parametre"
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/carte" element={<Carte/>}/>
        <Route path="/carte/:id" element={<Carte/>}/>
        <Route path="/client" element={<Client/>}/>
        <Route path="/clientform" element={<Clientform/>}/>
        <Route path="/clientform/:id" element={<Clientform/>}/>
        <Route path="/abonnement" element={<Abonnement/>}/>
        <Route path="/abonnementform" element={<Abonnementform/>}/>
        <Route path="/abonnementform/:id" element={<Abonnementform/>}/>
        <Route path="/caisse" element={<Caisse/>}/>
        <Route path="/parametre" element={<Parametre/>}/>
        </Routes>

    </div>
  )
}

export default App
