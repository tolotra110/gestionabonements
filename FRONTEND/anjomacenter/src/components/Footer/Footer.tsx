import { Wifi, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600">
                <Wifi className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-500">ANJOMA</h3>
                <p className="text-xs text-white">WiFi Zone Center</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white">
              Votre partenaire de confiance pour une connexion
              Internet rapide et sécurisée à Anjoma, Fianarantsoa.
            </p>
          </div>

           <div>
            <h3 className="font-bold text-white">Nos offres</h3>
            <ul className="mt-5 space-y-3 text-sm text-white">
              <li>1 Heure — 500 Ar</li>
              <li>2 Heures — 1 000 Ar</li>
              <li>5 Heure — 2 000 Ar</li>
              <li>10 Heure — 4 000 Ar</li>
               <li>1 mois — 35 000 Ar</li>
              <li>Options 1-(35 0000 Ar Annuelle)</li>
              <li>Options 2-LMVD(9 6000 Ar matin)</li>
              <li>Options 3-LMVD(9 6000 Ar  midi)</li>
              <li>Options 4 -MJS(9 6000 Ar  matin)</li>
              <li>Options 5-MJS(9 6000 Ar midi)</li>
            </ul>
          </div>
          <div >
            <h3 className="font-bold text-white">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-white">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
                <span>
                  Anjoma, Fianarantsoa,
                  <br />
                  Madagascar
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                +261 34 12 345 67
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                contact@anjomawifi.mg
              </li>
            </ul>
          </div>
  
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-white lg:px-8">
          © 2026 Anjoma WiFi Zone Center.
          Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}