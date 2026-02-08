"use strict";
import React, { useState } from 'react';
import { LayoutDashboard, Users, Activity, LogOut, Wifi, Zap, Loader2 } from 'lucide-react';
import { useSimulation } from '@/context/SimulationProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DashboardLayoutProps {
    children: React.ReactNode;
    selectedWard: string;
    onSelectWard: (wardId: string) => void;
}

const WARDS = [
    { id: 'all', name: 'All Wards', icon: LayoutDashboard },
    { id: 'ward-a', name: 'Ward A (General)', icon: Users },
    { id: 'ward-b', name: 'Ward B (Ortho)', icon: Users },
    { id: 'icu', name: 'Intensive Care (ICU)', icon: Activity },
    { id: 'er', name: 'Emergency Room', icon: Zap },
];

export default function DashboardLayout({ children, selectedWard, onSelectWard }: DashboardLayoutProps) {
    const router = useRouter();
    const { simulationState } = useSimulation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    return (
        <div className="min-h-screen bg-muted flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col fixed inset-y-0 left-0 z-20">
                <div className="h-16 flex items-center px-6 border-b border-border gap-3">
                    <img src="/logo.svg" alt="PulseGuard Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold text-foreground">PulseGuard</span>
                </div>

                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                        Wards & Units
                    </div>
                    {WARDS.map((ward) => {
                        const Icon = ward.icon;
                        const isActive = selectedWard === ward.id;
                        return (
                            <button
                                key={ward.id}
                                onClick={() => onSelectWard(ward.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-accent text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                {ward.name}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <LogOut className="w-5 h-5" />
                        )}
                        {isLoggingOut ? "Logging out..." : "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-foreground">
                        Doctor Dashboard
                    </h1>

                    <div className="flex items-center gap-6">
                        {/* 5G Status Indicator */}
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-muted rounded-full border border-border">
                            <div className={`w-2 h-2 rounded-full ${simulationState.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <div className="flex flex-col leading-none">
                                <span className="text-xs font-bold text-foreground">5G LIVE</span>
                                <span className="text-[10px] text-muted-foreground">{simulationState.latency}ms latency</span>
                            </div>
                            <Wifi className="w-4 h-4 text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                DR
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-slate-900">Dr. Sarah Wilson</p>
                                <p className="text-slate-500 text-xs">Head of Cardiology</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
