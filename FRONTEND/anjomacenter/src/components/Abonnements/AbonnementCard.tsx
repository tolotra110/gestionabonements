import { type CardProps } from "../../types/abonemment";

export default function AbonnementCard({
  title,
  value,
  description,
  icon,
}: CardProps) {
  return (
    <div className="bg-white w-112 rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300">
    
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h1>

          <p className="text-xs text-gray-400 mt-2">
            {description}
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

    </div>
  );
}
