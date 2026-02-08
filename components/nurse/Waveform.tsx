"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WaveformProps {
    title: string;
    color: string;
    type: "ecg" | "spo2";
    frequency?: number; // BPM, defaults to 60
}

export function Waveform({ title, color, type, frequency = 60 }: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize canvas to match container
        const resizeObserver = new ResizeObserver(() => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        });
        resizeObserver.observe(container);

        let animationFrameId: number;
        let x = 0;
        let lastY = canvas.height / 2;

        // ECG Pattern (P-QRS-T complex approximation)
        // Normalized 0-1 Time, -1 to 1 Amplitude
        const ecgPattern = [
            { t: 0.0, v: 0 },
            { t: 0.1, v: 0 },
            { t: 0.15, v: -0.1 }, // P wave
            { t: 0.25, v: 0 },
            { t: 0.3, v: 0 },
            { t: 0.32, v: -0.2 }, // Q
            { t: 0.35, v: 1.0 },  // R
            { t: 0.38, v: -0.4 }, // S
            { t: 0.45, v: 0 },
            { t: 0.5, v: 0 },
            { t: 0.6, v: 0.15 },  // T wave
            { t: 0.7, v: 0 },
            { t: 1.0, v: 0 },
        ];

        const getEcgValue = (progress: number) => {
            // Find segment
            for (let i = 0; i < ecgPattern.length - 1; i++) {
                if (progress >= ecgPattern[i].t && progress <= ecgPattern[i + 1].t) {
                    const t1 = ecgPattern[i].t;
                    const t2 = ecgPattern[i + 1].t;
                    const v1 = ecgPattern[i].v;
                    const v2 = ecgPattern[i + 1].v;
                    const localProgress = (progress - t1) / (t2 - t1);
                    return v1 + (v2 - v1) * localProgress;
                }
            }
            return 0;
        };

        const getSpo2Value = (progress: number) => {
            // Sine wave with a dicrotic notch
            // Main peak at 0.2, Notch at 0.5
            if (progress < 0.4) {
                return Math.sin(progress * Math.PI * 2.5) * 0.8;
            } else if (progress < 0.7) {
                return Math.sin((progress - 0.4) * Math.PI * 3) * 0.3; // Notch
            }
            return 0;
        };

        const draw = () => {
            // Speed calculation: 
            // Screen width represents e.g. 2 seconds of data?
            // Let's say we want 1 beat to take (60 / frequency) seconds.
            // 60BPM = 1 beat/sec. 120BPM = 2 beats/sec.

            const speed = (frequency / 60) * 2; // Pixels per frame multiplier roughly

            // Clear current column (scan bar effect)
            ctx.clearRect(x, 0, 5, canvas.height);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.moveTo(x - speed, lastY);

            // Calculate Y
            // We need a continuous 'time' or 'phase' variable for the wave pattern
            const now = Date.now() / 1000;
            const beatDuration = 60 / Math.max(frequency, 30);
            const phase = (now % beatDuration) / beatDuration;

            let amplitude = 0;
            if (type === "ecg") {
                amplitude = getEcgValue(phase);
            } else {
                amplitude = getSpo2Value(phase);
            }

            const baseLine = canvas.height / 2;
            const scale = canvas.height * 0.4;
            const y = baseLine - (amplitude * scale);

            ctx.lineTo(x, y);
            ctx.stroke();

            lastY = y;
            x += speed;

            if (x > canvas.width) {
                x = 0;
                ctx.moveTo(0, y);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [color, frequency, type]);

    return (
        <Card className="h-full bg-card border-border">
            <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium opacity-80`} style={{ color }}>
                    {title} Real-time
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] p-0 relative">
                <div ref={containerRef} className="absolute inset-0 w-full h-full">
                    <canvas ref={canvasRef} className="w-full h-full block" />
                </div>
            </CardContent>
        </Card>
    );
}
