"use strict";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
    role: "doctor" | "nurse" | "patient";
    type: "login" | "signup";
}

export function AuthForm({ role, type }: AuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");

    // Check session state (from master branch)
    const [checkingSession, setCheckingSession] = useState(true);
    const [existingSession, setExistingSession] = useState<{
        isLoggedIn: boolean;
        role: "doctor" | "nurse" | "patient" | null;
    }>({ isLoggedIn: false, role: null });

    // Check for existing session on mount (from master branch)
    useEffect(() => {
        async function checkExistingSession() {
            // Only check session for login pages, not signup
            if (type !== "login") {
                setCheckingSession(false);
                return;
            }

            try {
                // Dynamic import to avoid circular dependencies if any
                const { getCurrentUser, getUserProfile } = await import("@/lib/auth");

                const { user } = await getCurrentUser();
                if (!user) {
                    setCheckingSession(false);
                    return;
                }

                const { profile } = await getUserProfile(user.id);
                if (profile) {
                    setExistingSession({ isLoggedIn: true, role: profile.role });
                }
            } catch (err) {
                console.error("Session check error:", err);
            } finally {
                setCheckingSession(false);
            }
        }

        checkExistingSession();
    }, [type]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        try {
            if (isVerifying) {
                const otp = formData.get("otp") as string;
                const { verifyEmailOtp } = await import("@/lib/auth");

                const { error: verifyError } = await verifyEmailOtp(pendingEmail, otp);

                if (verifyError) {
                    setError(verifyError.message);
                    return;
                }

                // Verification successful
                router.push(`/${role}/dashboard`); // Or login
                return;
            }

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (type === "login") {
                const { signInWithProfile } = await import("@/lib/auth");
                const { profile, error: authError } = await signInWithProfile(email, password);

                if (authError) {
                    setError(authError.message);
                    return;
                }

                if (!profile) {
                    setError("Authentication failed. Please try again.");
                    return;
                }

                const redirectMap = {
                    doctor: "/doctor/dashboard",
                    nurse: "/nurse/dashboard",
                    patient: "/patient/dashboard",
                };

                const redirectTo = redirectMap[profile.role] || "/";
                router.push(redirectTo);
            } else {
                // Signup flow
                const fullName = formData.get("fullName") as string;
                const { signUpUser } = await import("@/lib/auth");

                const { user, session, error: authError } = await signUpUser(
                    email,
                    password,
                    fullName,
                    role
                );

                if (authError) {
                    setError(authError.message);
                    return;
                }

                if (!user && !session) {
                    setError("Signup failed. Please try again.");
                    return;
                }

                if (session) {
                    // Auto-confirmed (email confirmation disabled or unnecessary)
                    const redirectMap = {
                        doctor: "/doctor/dashboard",
                        nurse: "/nurse/dashboard",
                        patient: "/patient/dashboard",
                    };
                    const redirectTo = redirectMap[role] || "/";
                    router.push(redirectTo);
                    return;
                }

                // Switch to verification mode (email confirmation enabled)
                setPendingEmail(email);
                setIsVerifying(true);
                setError(null); // Clear any errors
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const roleLabels = {
        doctor: "Doctor",
        nurse: "Nurse",
        patient: "Patient",
    };

    const roleColors = {
        doctor: "text-blue-600",
        nurse: "text-teal-600",
        patient: "text-indigo-600",
    };

    // Show loading state while checking session
    if (checkingSession) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-xl">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </CardContent>
            </Card>
        );
    }

    // If already logged in, show message instead of form
    if (existingSession.isLoggedIn && existingSession.role) {
        const dashboardMap = {
            doctor: "/doctor/dashboard",
            nurse: "/nurse/dashboard",
            patient: "/patient/dashboard",
        };
        const dashboardUrl = dashboardMap[existingSession.role];

        return (
            <Card className="w-full max-w-md mx-auto shadow-xl">
                <CardHeader className="space-y-1">
                    <Link
                        href="/"
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                    <CardTitle className="text-2xl font-bold">Already Logged In</CardTitle>
                    <CardDescription>
                        You are already logged in as {roleLabels[existingSession.role]}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        className="w-full"
                        onClick={() => router.push(dashboardUrl)}
                    >
                        Go to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isVerifying) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Verify your account</CardTitle>
                    <CardDescription>
                        Enter the code sent to <span className="font-semibold">{pendingEmail}</span>
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input
                                id="otp"
                                name="otp"
                                placeholder="123456"
                                required
                                disabled={isLoading}
                                autoComplete="one-time-code"
                                className="text-center text-lg tracking-widest bg-background text-foreground"
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-red-500 font-medium">{error}</div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Account
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            type="button"
                            onClick={() => setIsVerifying(false)}
                            disabled={isLoading}
                        >
                            Back to Signup
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl">
            <CardHeader className="space-y-1">
                <Link
                    href="/"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                <CardTitle className="text-2xl font-bold">
                    {type === "login" ? "Welcome back" : "Create an account"}
                </CardTitle>
                <CardDescription>
                    {type === "login" ? "Sign in to your" : "Register as a"}{" "}
                    <span className={`font-semibold ${roleColors[role]}`}>
                        {roleLabels[role]}
                    </span>{" "}
                    account
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {type === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                required
                                disabled={isLoading}
                                autoComplete="name"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 font-medium">{error}</div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {type === "login" ? "Sign In" : "Create Account"}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                        {type === "login" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Link
                                    href={`/${role}/signup`}
                                    className="text-foreground font-medium hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link
                                    href={`/${role}/login`}
                                    className="text-foreground font-medium hover:underline"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
