import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: LucideIcon;
    status: "Normal" | "Warning" | "Critical";
    trend?: "up" | "down" | "stable";
}

export function VitalCard({ title, value, unit, icon: Icon, status, trend }: VitalCardProps) {
    const statusColors = {
        Normal: "text-slate-900",
        Warning: "text-yellow-600",
        Critical: "text-red-600 animate-pulse",
    };

    const borderColors = {
        Normal: "border-slate-200",
        Warning: "border-yellow-400 bg-yellow-50",
        Critical: "border-red-500 bg-red-50",
    };

    return (
        <Card className={`${borderColors[status]} transition-colors duration-500`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    {title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${statusColors[status]}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${statusColors[status]}`}>
                    {value} <span className="text-xs font-normal text-slate-500">{unit}</span>
                </div>
                {/* Simple trend indicator could go here */}
            </CardContent>
        </Card>
    );
}
