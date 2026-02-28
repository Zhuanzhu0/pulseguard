"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initialPatients, Patient, Vitals } from "@/lib/mock-data";
import { usePatientSync } from "@/hooks/use-patient-sync";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Thermometer, Wind, Wifi, ArrowUp, ArrowDown, ArrowRight, LogOut, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Type for vitals sync custom event
interface VitalSyncEvent extends CustomEvent<Vitals> {
    type: "vital-sync";
}

declare global {
    interface WindowEventMap {
        "vital-sync": VitalSyncEvent;
    }
}

interface VitalsCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend: 'up' | 'down' | 'stable';
}

const VitalsCard = ({ title, value, unit, icon: Icon, color, trend }: VitalsCardProps) => (
    <Card 
        className="relative overflow-hidden rounded-3xl border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 group"
        role="status"
        aria-live="polite"
        aria-atomic="true"
    >
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${color} opacity-80`} aria-hidden="true" />
        <CardContent className="p-6 pl-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <div className="flex items-baseline gap-1.5">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {value}
                        </h3>
                        <span className="text-sm text-slate-500 font-medium">{unit}</span>
                    </div>
                </div>
                <div className={`p-2.5 rounded-2xl transition-colors ${color.replace('bg-', 'bg-opacity-10 bg-')} ${color.replace('bg-', 'text-')}`} aria-hidden="true">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm pt-2 border-t border-slate-50">
                {trend === 'up' && <ArrowUp className="h-4 w-4 text-rose-500" aria-hidden="true" />}
                {trend === 'down' && <ArrowDown className="h-4 w-4 text-emerald-500" aria-hidden="true" />}
                {trend === 'stable' && <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />}
                <span className="text-slate-500 font-medium" aria-label={`Trend: ${trend} compared to last hour`}>vs last hour</span>
            </div>
        </CardContent>
    </Card>
);

export default function PatientDashboard() {
    const router = useRouter();
    const [patient, setPatient] = useState<Patient | null>(null);
    const { isConnected, lastSync } = usePatientSync("p1");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const healthData = [
        { time: "06:00", heartRate: 68, spo2: 98 },
        { time: "09:00", heartRate: 72, spo2: 97 },
        { time: "12:00", heartRate: 75, spo2: 98 },
        { time: "15:00", heartRate: 71, spo2: 96 },
        { time: "18:00", heartRate: 74, spo2: 98 },
        { time: "21:00", heartRate: 69, spo2: 99 },
    ];

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            const { signOutUser } = await import("@/lib/auth");
            const { error } = await signOutUser();

            if (error) {
                toast.error("Failed to log out. Please try again.");
                setIsLoggingOut(false);
                return;
            }

            // Success - redirect to home
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("Failed to log out. Please try again.");
            setIsLoggingOut(false);
        }
    }

    // Listen for sync updates
    useEffect(() => {
        setLastUpdate(new Date());

        // Load user name and data from localStorage
        const loadData = async () => {
            const { getStoredPatients } = await import("@/lib/mock-data");
            const storedPatients = getStoredPatients();
            const myself = storedPatients.find(p => p.id === "p1");
            if (myself) {
                setPatient(myself);
            }
            setIsLoading(false);
        };
        loadData();
        const handleVitalSync = (event: VitalSyncEvent) => {
            setPatient(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    vitals: event.detail
                };
            });
            setLastUpdate(new Date());
        };

        window.addEventListener("vital-sync", handleVitalSync);
        return () => window.removeEventListener("vital-sync", handleVitalSync);
    }, []);

    // Loading state
    if (isLoading || !patient) {
        return (
            <div className="space-y-6 pb-20 bg-background min-h-screen">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="h-9 w-64 bg-muted-foreground/20 rounded animate-pulse" />
                        <div className="h-5 w-48 bg-muted-foreground/10 rounded mt-2 animate-pulse" />
                    </div>
                </div>
                <div className="h-32 w-full bg-muted-foreground/20 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-36 bg-muted-foreground/20 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 bg-background min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Good Morning, {patient.name.split(' ')[0]}</h1>
                    <p className="text-muted-foreground mt-1">Here is your daily health summary</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                        <div className={`flex items-center gap-2 ${isConnected ? "text-emerald-600 dark:text-emerald-500" : "text-amber-500"}`}>
                            <Wifi className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">{isConnected ? "5G Sync Active" : "Connecting..."}</span>
                        </div>
                        <span className="h-4 w-px bg-border" />
                        <span className="text-xs text-muted-foreground">
                            Last update: {lastUpdate?.toLocaleTimeString() ?? "Syncing..."}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="gap-2"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </div>

            {/* Health Status Banner */}
            <div className={`rounded-xl p-6 text-white shadow-lg transition-colors duration-500 ${patient.status === 'Stable' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
                patient.status === 'Warning' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                    'bg-gradient-to-r from-red-600 to-rose-600'
                }`}>
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Activity className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold opacity-90">Current Status</h2>
                        <div className="text-3xl font-bold tracking-tight">{patient.status}</div>
                    </div>
                    <div className="ml-auto text-right hidden sm:block">
                        <div className="text-sm opacity-75">Assigned Doctor</div>
                        <div className="font-semibold">{patient.assignedDoctor}</div>
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalsCard
                    title="Heart Rate"
                    value={patient.vitals.heartRate}
                    unit="bpm"
                    icon={Heart}
                    color="bg-rose-500"
                    trend={patient.vitals.heartRate > 100 ? 'up' : 'stable'}
                />
                <VitalsCard
                    title="Blood Pressure"
                    value={`${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia}`}
                    unit="mmHg"
                    icon={Activity}
                    color="bg-blue-500"
                    trend="stable"
                />
                <VitalsCard
                    title="SpO2"
                    value={patient.vitals.spo2}
                    unit="%"
                    icon={Wind}
                    color="bg-sky-500"
                    trend={patient.vitals.spo2 < 95 ? 'down' : 'stable'}
                />
                <VitalsCard
                    title="Body Temp"
                    value={patient.vitals.temperature}
                    unit="°C"
                    icon={Thermometer}
                    color="bg-amber-500"
                    trend={patient.vitals.temperature > 37.5 ? 'up' : 'stable'}
                />
            </div>

            {/* Daily Chart Placeholder (Recharts would go here) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-3xl border-none shadow-md bg-white">
                    <CardHeader className="pl-8 pt-8">
                        <CardTitle>Health Trends (24h)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-4 pr-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={healthData}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                                    labelStyle={{ color: '#64748B', marginBottom: '8px', fontWeight: '500' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="heartRate"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorHr)"
                                    name="Heart Rate (bpm)"
                                    animationDuration={1500}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="spo2"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSpo2)"
                                    name="SpO2 (%)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-md bg-white">
                    <CardHeader className="pl-8 pt-8">
                        <CardTitle className="text-xl font-bold text-slate-900">Next Medication</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        {patient.medications.length > 0 ? (
                            <div className="space-y-5">
                                <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-lg text-blue-900">{patient.medications[0].name}</h4>
                                        <Badge variant="secondary" className="bg-white/80 text-blue-800 shadow-sm backdrop-blur-sm">
                                            {patient.medications[0].time}
                                        </Badge>
                                    </div>
                                    <p className="text-blue-700/80 mb-3">{patient.medications[0].dosage} • {patient.medications[0].instructions}</p>
                                </div>
                                <div className="text-center">
                                    <Link href="/patient/medications" className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                        View Full Schedule &rarr;
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500">No upcoming medications.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
