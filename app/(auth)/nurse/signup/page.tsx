import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nurse Registration | PulseGuard",
    description: "Create a new nurse account",
};

export default function NurseSignupPage() {
    return <AuthForm role="nurse" type="signup" />;
}
