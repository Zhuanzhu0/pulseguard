import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Patient Registration | PulseGuard",
    description: "Create a new patient account",
};

export default function PatientSignupPage() {
    return <AuthForm role="patient" type="signup" />;
}
