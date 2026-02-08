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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { Patient } from "@/lib/mock-data";

interface AdmitPatientModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (patient: Partial<Patient>) => void;
}

export function AdmitPatientModal({ open, onOpenChange, onConfirm }: AdmitPatientModalProps) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
    const [condition, setCondition] = useState("");
    const [ward, setWard] = useState("Emergency");

    const handleConfirm = () => {
        if (name && age && condition) {
            onConfirm({
                name,
                age: parseInt(age),
                gender,
                ward,
                // We can pass condition as a note or initial diagnosis if data model supports, 
                // or just use it to determine initial status/ward in the parent.
            });
            onOpenChange(false);
            // Reset
            setName("");
            setAge("");
            setGender("Male");
            setCondition("");
            setWard("Emergency");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Admit New Patient
                    </DialogTitle>
                    <DialogDescription>
                        Enter patient details for immediate admission.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="age" className="text-right">
                            Age
                        </Label>
                        <Input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="col-span-3"
                            placeholder="45"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Gender</Label>
                        <div className="col-span-3">
                            <Select onValueChange={(v: any) => setGender(v)} value={gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ward" className="text-right">Ward</Label>
                        <div className="col-span-3">
                            <Select onValueChange={setWard} value={ward}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                    <SelectItem value="ICU-A">ICU A</SelectItem>
                                    <SelectItem value="ICU-B">ICU B</SelectItem>
                                    <SelectItem value="Gen-A">General A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="condition" className="text-right">
                            Condition
                        </Label>
                        <Input
                            id="condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="col-span-3"
                            placeholder="Chest Pain, Fracture, etc."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleConfirm} disabled={!name || !age || !condition}>
                        Admit Patient
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
