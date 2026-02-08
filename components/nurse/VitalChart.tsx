"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalChartProps {
    title: string;
    data: any[];
    dataKey: string;
    color: string;
    domain?: [number, number];
}

export function VitalChart({ title, data, dataKey, color, domain }: VitalChartProps) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    {title} History
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={domain || ["auto", "auto"]} hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                fontSize: "12px",
                                border: "1px solid #e2e8f0",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
