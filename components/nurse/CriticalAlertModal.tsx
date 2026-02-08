import { useRef, useEffect } from "react";
import { AlertTriangle, Phone, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CriticalAlertModalProps {
    patientName: string;
    onAcknowledge: () => void;
    onEscalate: () => void;
    isEscalating: boolean;
    doctorName?: string;
    escalationStatus?: "idle" | "sending" | "sent";
}

export function CriticalAlertModal({
    patientName,
    onAcknowledge,
    onEscalate,
    isEscalating,
    doctorName,
    escalationStatus,
}: CriticalAlertModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Auto-focus logic for accessibility
    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div
                ref={modalRef}
                tabIndex={-1}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-red-500 outline-none"
            >
                {/* Flashing Header */}
                <div className="bg-red-600 text-white p-6 animate-pulse flex items-center justify-center gap-3">
                    <AlertTriangle className="w-10 h-10" />
                    <h2 className="text-3xl font-extrabold uppercase tracking-wider">
                        Critical Alert
                    </h2>
                </div>

                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Patient: {patientName}
                        </h3>
                        <p className="text-red-600 font-medium text-lg">
                            Vitals indicate critical instability. Immediate action required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button
                            size="lg"
                            variant="destructive"
                            className="w-full text-lg h-16 shadow-lg shadow-red-200"
                            onClick={onEscalate}
                            disabled={isEscalating}
                        >
                            {isEscalating ? (
                                <>Sending Alert...</>
                            ) : (
                                <>
                                    <Phone className="mr-2 h-6 w-6" /> Escalate to Doctor
                                </>
                            )}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full text-lg h-14 border-slate-300 hover:bg-slate-50"
                            onClick={onAcknowledge}
                        >
                            <Activity className="mr-2 h-5 w-5" /> I am handling this
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
