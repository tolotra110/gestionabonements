import { type CardProps } from "../../types/abonemment";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";

export default function AbonnementCard({
  title,
  value,
  description,
  icon,
}: CardProps) {
  return (
    <Card className="w-full gap-0 border-blue-100 bg-white py-4 shadow-sm shadow-slate-200/50">
      <CardHeader className="flex flex-row items-center justify-between px-4 pb-0">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 [&_svg]:size-4">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-2">
        <p className="text-3xl font-semibold tracking-tight tabular-nums text-slate-900">{value}</p>
        <CardDescription className="mt-1 text-xs text-slate-500">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
