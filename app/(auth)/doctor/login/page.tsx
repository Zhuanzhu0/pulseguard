import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Doctor Login | PulseGuard",
    description: "Sign in to your doctor account",
};

export default function DoctorLoginPage() {
    return <AuthForm role="doctor" type="login" />;
}
