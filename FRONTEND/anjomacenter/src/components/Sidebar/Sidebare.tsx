
import { useState } from "react";
import {
LayoutDashboardIcon,Wallet,
Wifi,
CreditCard,
Settings,PersonStanding,
LogOutIcon
} from "lucide-react";
import logo from "../../assets/images/anjoma.jpg";
import { Link } from "react-router-dom";

export  function Sidebare() {
    const [active, setActive] = useState();
    const listitem=[
        {

            id:1,
        icone:LayoutDashboardIcon,
        libelle:"Dashboard",
        Link:"/dashboard"
    },
{
    id:2,
    icone:PersonStanding,
    libelle:"Client",
    Link:"/client"
},{
    id:3,
    icone:Wifi,
    libelle:"Abonnement",
    Link:"/abonnement"
},
{
    id:4,
    icone:Wallet,
    libelle:"Caisse"
},
{
    id:5,
    icone:CreditCard,
    libelle:"Carte"
}
,{
    id:6,
    icone:Settings,
    libelle:"Parametre"
},
]
  return (
      <>
      <div className='flex flex-col gap-12 bg-slate-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] h-195 w-60'>
        <div className="flex h-20 items-center gap-3 border-b border-slate-700 px-5">
        <img
          src={logo}
          alt="Logo ANJOMA"
          className="h-14 w-14 rounded-2xl object-cover shadow-lg"
        />

        <div>
          <h1 className="text-sm font-bold">
            ANJOMA WIFI
          </h1>

          <p className="text-xs text-slate-400">
            Zone Center
          </p>
        </div>
      </div>
      <div className='flex flex-col gap-2 py-12 px-2 '>
        {listitem.map((item)=>(
          <ul
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex cursor-pointer rounded-lg w-53 h-12 p-2 gap-2 items-center transition-colors ${
              active === item.id
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <li><item.icone className="h-5 w-5" /></li>
            <Link to={item.Link}>{item.libelle}</Link>
          </ul>
        ))}
   
      </div>
              <button className="flex py-2 px-4 hover:bg-blue-700 rounded-lg w-55 h-10 ml-2 gap-2"><LogOutIcon/>Deconnexion</button>
   
      </div>
      </>
    



     
  
  
  );
    
}

