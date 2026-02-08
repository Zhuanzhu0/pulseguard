"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, FileText } from "lucide-react";

interface DischargeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
    patientName: string;
}

export function DischargeModal({ open, onOpenChange, onConfirm, patientName }: DischargeModalProps) {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (reason) {
            onConfirm(reason);
            onOpenChange(false);
            setReason("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-orange-600">
                        <FileText className="h-5 w-5" />
                        Request Patient Discharge
                    </DialogTitle>
                    <DialogDescription>
                        Initiate discharge workflow for <strong>{patientName}</strong>. This request requires doctor approval.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-sm text-orange-800 flex gap-2 items-start my-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>Ensure all active treatments are completed and the patient is stable before requesting.</p>
                </div>

                <div className="py-2">
                    <label className="text-sm font-medium mb-2 block">Discharge Note / Reason</label>
                    <Textarea
                        placeholder="e.g. Patient stable, vitals normal for 24h. Family requested discharge."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                    >
                        Submit Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
