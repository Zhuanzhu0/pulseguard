"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function PatientError({ error, reset }: ErrorProps) {
    useEffect(() => {
        logger.error("Patient dashboard error", {
            message: error.message,
            digest: error.digest,
        });
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5">
                    <AlertTriangle className="w-7 h-7 text-blue-600" />
                </div>
                
                <h1 className="text-xl font-bold text-slate-900 mb-2">
                    Dashboard Error
                </h1>
                
                <p className="text-slate-600 mb-6 text-sm">
                    Failed to load your dashboard. Please try again or return to the home page.
                </p>

                <div className="flex flex-col gap-3">
                    <Button onClick={reset} className="w-full gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Reload Dashboard
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
