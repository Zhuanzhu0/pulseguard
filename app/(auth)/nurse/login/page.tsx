import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nurse Login | PulseGuard",
    description: "Sign in to your nurse account",
};

export default function NurseLoginPage() {
    return <AuthForm role="nurse" type="login" />;
}
