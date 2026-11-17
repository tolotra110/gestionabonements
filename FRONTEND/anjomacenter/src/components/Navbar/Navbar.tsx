import { Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/auth";

export default function Navbar() {
  const { user } = useAuth();
  const initiale = user?.email.charAt(0).toUpperCase() ?? "A";

  return (
    <div className="flex h-12 w-full items-center justify-end gap-4 border-b border-gray-100 bg-white px-5 shadow-[0_4px_12px_0_rgba(0,0,0,0.1)]">
      <Bell
        size={21}
        className="cursor-pointer text-gray-600 hover:text-blue-600"
      />

      <div className="flex cursor-pointer items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-blue-600 text-xs font-bold text-white">
          {initiale}
        </div>

        <span className="text-sm font-medium text-gray-700">{user?.email}</span>

        <ChevronDown size={16} className="text-gray-500" />
      </div>
    </div>
  );
}
