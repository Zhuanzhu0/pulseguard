import { useState, useEffect } from "react";
import {
    Phone, Mic, MicOff, Volume2, Video, PhoneOff,
    User, Signal, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InAppCallOverlayProps {
    doctorName: string;
    onEndCall: () => void;
}

export function InAppCallOverlay({ doctorName, onEndCall }: InAppCallOverlayProps) {
    const [callState, setCallState] = useState<"connecting" | "ringing" | "connected" | "ended">("connecting");
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);

    // Simulate call lifecycle
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (callState === "connecting") {
            timer = setTimeout(() => setCallState("ringing"), 1500);
        } else if (callState === "ringing") {
            timer = setTimeout(() => setCallState("connected"), 2500);
        } else if (callState === "connected") {
            timer = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }

        return () => clearTimeout(timer); // Cleanup
    }, [callState]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-between py-12 animate-in fade-in duration-300">

            {/* Top Status Bar */}
            <div className="w-full max-w-sm flex justify-between items-center px-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                    <Signal className="w-4 h-4 text-green-500" />
                    <span>HD Voice</span>
                </div>
                <span>{callState === "connected" ? formatTime(duration) : "Calling..."}</span>
            </div>

            {/* Main Avatar Area */}
            <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500">
                <div className="relative">
                    {callState === "ringing" && (
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                    )}
                    <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorName}`} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                            {doctorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{doctorName}</h2>
                    <p className="text-muted-foreground font-medium animate-pulse">
                        {callState === "connecting" && "Connecting..."}
                        {callState === "ringing" && "Ringing..."}
                        {callState === "connected" && "Connected"}
                        {callState === "ended" && "Call Ended"}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-sm px-6 grid grid-cols-3 gap-6">
                {/* Mute Button */}
                <div className="flex flex-col items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-14 h-14 rounded-full transition-all ${isMuted ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>
                    <span className="text-xs text-slate-400">Mute</span>
                </div>

                {/* Video Button (Disabled) */}
                <div className="flex flex-col items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-14 h-14 rounded-full bg-slate-50 text-slate-300 cursor-not-allowed"
                    >
                        <Video className="w-6 h-6" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Video</span>
                </div>

                {/* Speaker Button */}
                <div className="flex flex-col items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-14 h-14 rounded-full transition-all ${isSpeaker ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        onClick={() => setIsSpeaker(!isSpeaker)}
                    >
                        <Volume2 className="w-6 h-6" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Speaker</span>
                </div>

                {/* spacer */}
                <div className="col-span-3 flex justify-center pt-8">
                    <Button
                        variant="destructive"
                        size="icon"
                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 animate-in slide-in-from-bottom-4"
                        onClick={() => {
                            setCallState("ended");
                            setTimeout(onEndCall, 1000);
                        }}
                    >
                        <PhoneOff className="w-8 h-8" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
