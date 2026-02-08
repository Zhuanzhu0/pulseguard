"use client";

import { useState, useEffect, useRef } from "react";
import { type Patient, type Vitals } from "@/lib/mock-data";

// Helper to keep values in realistic ranges
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export function useVitalSimulation(initialPatient: Patient) {
    const [patient, setPatient] = useState<Patient>(initialPatient);
    const [history, setHistory] = useState<{ time: string; hr: number; spo2: number }[]>([]);

    // Use refs for values that change constantly to avoid dependency cycles in interval
    const patientRef = useRef(initialPatient);

    useEffect(() => {
        patientRef.current = initialPatient;
        setPatient(initialPatient);
    }, [initialPatient.id]); // Reset when ID changes

    useEffect(() => {
        // Initialize history
        const initialHistory = Array.from({ length: 20 }, (_, i) => ({
            time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString(),
            hr: initialPatient.vitals.heartRate,
            spo2: initialPatient.vitals.spo2,
        }));
        setHistory(initialHistory);

        const interval = setInterval(() => {
            const current = patientRef.current;
            const { vitals, status } = current;

            // Determine fluctuation based on status
            const stress = status === "Critical" ? 2.5 : status === "Warning" ? 1.5 : 0.5;

            const newVitals: Vitals = {
                heartRate: clamp(vitals.heartRate + (Math.random() - 0.5) * 4 * stress, 30, 220),
                bloodPressureSys: clamp(vitals.bloodPressureSys + (Math.random() - 0.5) * 3 * stress, 60, 250),
                bloodPressureDia: clamp(vitals.bloodPressureDia + (Math.random() - 0.5) * 2 * stress, 40, 160),
                spo2: clamp(vitals.spo2 + (Math.random() - 0.5) * 1 * stress, 70, 100),
                temperature: clamp(vitals.temperature + (Math.random() - 0.5) * 0.1, 35, 42),
                respiratoryRate: clamp(vitals.respiratoryRate + (Math.random() - 0.5) * 2 * stress, 8, 45),
            };

            // Auto-update status logic (simple threshold check)
            let newStatus = current.status;
            // Only escalate automatically if not already handled/stable-ish to avoid overriding manual actions too aggressively
            // For this demo, we'll let the user manually escalate mainly, or simulated "events"

            const updatedPatient = { ...current, vitals: newVitals, status: newStatus };
            patientRef.current = updatedPatient;
            setPatient(updatedPatient);

            setHistory((prev) => {
                const newPoint = {
                    time: new Date().toLocaleTimeString(),
                    hr: newVitals.heartRate,
                    spo2: newVitals.spo2,
                };
                return [...prev.slice(1), newPoint];
            });

        }, 2000); // Update every 2 seconds for smoothness

        return () => clearInterval(interval);
    }, [initialPatient.id]);

    // Manual actions
    const updateStatus = (status: Patient["status"]) => {
        const updated = { ...patientRef.current, status };
        patientRef.current = updated;
        setPatient(updated);
    };

    return { patient, history, updateStatus };
}
