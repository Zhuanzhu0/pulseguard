"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to monitoring service
        logger.error("Global error boundary caught error", {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
        });
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Something went wrong
                </h1>
                
                <p className="text-slate-600 mb-6">
                    We encountered an unexpected error. Our team has been notified and is working to fix it.
                </p>

                {process.env.NODE_ENV === "development" && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg text-left overflow-auto max-h-40">
                        <p className="text-xs font-mono text-red-600 break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try again
                    </Button>
                    
                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link href="/" className="gap-2">
                            <Home className="w-4 h-4" />
                            Go home
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-slate-400">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
