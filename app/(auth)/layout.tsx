import { HeartPulse } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex flex-col bg-slate-900 text-white p-10 justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 text-2xl font-bold">
                    <img src="/logo.svg" alt="PulseGuard Logo" className="w-8 h-8 object-contain" />
                    PulseGuard
                </div>
                <div className="relative z-10 space-y-6 max-w-lg">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Intelligent Health Monitoring & Triage
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Seamlessly connect patients, doctors, and nurses with real-time
                        vitals monitoring and AI-driven insights.
                    </p>
                </div>
                <div className="relative z-10 text-sm text-slate-400">
                    © {new Date().getFullYear()} PulseGuard System
                </div>

                {/* Background Pattern */}
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -left-20 top-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="flex items-center justify-center p-8 bg-slate-50">
                <div className="flex lg:hidden absolute top-8 left-8 items-center gap-3 font-bold text-slate-900">
                    <img src="/logo.svg" alt="PulseGuard Logo" className="w-8 h-8 object-contain" />
                    PulseGuard
                </div>
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </div>
        </div>
    );
}
