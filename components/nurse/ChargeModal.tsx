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
import { DollarSign } from "lucide-react";

interface ChargeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (item: { description: string; cost: number }) => void;
}

export function ChargeModal({ open, onOpenChange, onConfirm }: ChargeModalProps) {
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [type, setType] = useState("custom");

    const commonItems = [
        { label: "ICU Night Charge", cost: 1200 },
        { label: "General Ward Night", cost: 400 },
        { label: "Oxygen Therapy (1hr)", cost: 50 },
        { label: "Blood Test Panel", cost: 200 },
        { label: "MRI Scan", cost: 800 },
        { label: "Doctor Consultation", cost: 150 },
    ];

    const handleSelect = (value: string) => {
        setType(value);
        if (value !== "custom") {
            const item = commonItems.find(i => i.label === value);
            if (item) {
                setDescription(item.label);
                setCost(item.cost.toString());
            }
        } else {
            setDescription("");
            setCost("");
        }
    };

    const handleConfirm = () => {
        if (description && cost) {
            onConfirm({ description, cost: Number(cost) });
            onOpenChange(false);
            // Reset
            setDescription("");
            setCost("");
            setType("custom");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Patient Charge</DialogTitle>
                    <DialogDescription>
                        Record a medical service or item for billing.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Quick Select</Label>
                        <div className="col-span-3">
                            <span className="text-xs text-slate-500 mb-2 block">Optional</span>
                            <Select onValueChange={handleSelect} value={type}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select item" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Custom Item</SelectItem>
                                    {commonItems.map((item) => (
                                        <SelectItem key={item.label} value={item.label}>
                                            {item.label} (${item.cost})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cost" className="text-right">
                            Cost ($)
                        </Label>
                        <div className="col-span-3 relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                id="cost"
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleConfirm} disabled={!description || !cost}>
                        Add Charge
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
