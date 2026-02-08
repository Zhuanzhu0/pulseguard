import Link from "next/link";
import { User, Stethoscope, HeartPulse, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Hero Section */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img src="/logo.svg" alt="PulseGuard Logo" className="object-contain w-full h-full" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              PulseGuard
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Intelligent Patient Monitoring & Triage
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select your role to access the platform. Secure, role-based access for healthcare professionals and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Doctor Card */}
            <RoleCard
              title="Doctor"
              description="Monitor patients, review AI alerts, and manage treatments."
              icon={<Stethoscope className="w-12 h-12 text-blue-600" />}
              href="/doctor/signup"
              signInHref="/doctor/login"
              color="bg-white/60 hover:border-blue-200 ring-1 ring-blue-100"
              buttonColor="bg-primary hover:bg-primary/90"
            />

            {/* Nurse Card */}
            <RoleCard
              title="Nurse"
              description="Track vitals, manage admissions, and handle equipment."
              icon={<HeartPulse className="w-12 h-12 text-teal-600" />}
              href="/nurse/signup"
              signInHref="/nurse/login"
              color="bg-white/60 hover:border-teal-200 ring-1 ring-teal-100"
              buttonColor="bg-teal-600 hover:bg-teal-700"
            />

            {/* Patient Card */}
            <RoleCard
              title="Patient"
              description="View health records, appointments, and personal vitals."
              icon={<User className="w-12 h-12 text-indigo-600" />}
              href="/patient/signup"
              signInHref="/patient/login"
              color="bg-white/60 hover:border-indigo-200 ring-1 ring-indigo-100"
              buttonColor="bg-indigo-600 hover:bg-indigo-700"
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} PulseGuard System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function RoleCard({
  title,
  description,
  icon,
  href,
  signInHref,
  color,
  buttonColor,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  signInHref: string;
  color: string;
  buttonColor: string;
}) {
  return (
    <div
      className={`relative p-8 rounded-2xl border border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${color} flex flex-col items-center text-center group backdrop-blur-sm`}
    >
      <div className="mb-6 p-4 bg-white rounded-full shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-8 flex-1">{description}</p>

      <div className="w-full space-y-4">
        <Link
          href={href}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold shadow-md transition-colors ${buttonColor}`}
        >
          Sign Up as {title}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href={signInHref}
            className="font-medium text-slate-900 hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
