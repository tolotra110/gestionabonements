
import { Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-white  flex items-center justify-end gap-4 border-b border-gray-100 w-278 shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] h-12 px-5">

      <Bell
        size={21}
        className="text-gray-600 cursor-pointer hover:text-blue-600"
      />


      <div className="flex items-center gap-2 cursor-pointer">


        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
          <img
            src="/profile.jpg"
            alt="Profil"
            className="w-full h-full object-cover"
          />
        </div>

        <span className="text-sm font-medium text-gray-700">
          Bienheureux
        </span>

        <ChevronDown size={16} className="text-gray-500" />

      </div>

    </div>
  );
}