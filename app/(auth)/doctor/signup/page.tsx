import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Doctor Registration | PulseGuard",
    description: "Create a new doctor account",
};

export default function DoctorSignupPage() {
    return <AuthForm role="doctor" type="signup" />;
}
