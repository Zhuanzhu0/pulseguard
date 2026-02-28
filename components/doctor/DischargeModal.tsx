"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { Patient } from '../../types/doctor';

interface DischargeModalProps {
    patient: Patient;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: (reason: string) => void;
}

export function DischargeModal({ patient, isOpen, onClose, onApprove, onReject }: DischargeModalProps) {
    const [rejectReason, setRejectReason] = useState('');
    const [view, setView] = useState<'main' | 'reject'>('main');
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Focus trap - keep focus within modal
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key !== 'Tab') return;

        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
        }
    }, [onClose]);

    // Manage focus when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // Store currently focused element to restore later
            previousActiveElement.current = document.activeElement as HTMLElement;
            // Focus the close button when modal opens
            setTimeout(() => closeButtonRef.current?.focus(), 0);
            // Add keydown listener for focus trap and escape
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            // Restore focus to previously focused element
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, handleKeyDown]);

    // Reset view when modal closes
    useEffect(() => {
        if (!isOpen) {
            setView('main');
            setRejectReason('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const titleId = 'discharge-modal-title';
    const descriptionId = 'discharge-modal-description';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="presentation"
            onClick={(e) => {
                // Close on backdrop click
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 id={titleId} className="text-lg font-bold text-slate-800">
                        {view === 'reject' ? 'Reject Discharge' : 'Discharge Request'}
                    </h3>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="p-6">
                    {view === 'main' ? (
                        <>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full" aria-hidden="true">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{patient.name}</h4>
                                    <p className="text-sm text-slate-500">ID: {patient.id} • Bed: {patient.bedNumber}</p>
                                    <p id={descriptionId} className="mt-2 text-slate-600">
                                        Nurse has requested discharge for this patient. Please review latest vitals and reports before approving.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setView('reject')}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={onApprove}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <Check className="w-4 h-4" aria-hidden="true" />
                                    Approve Discharge
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <label
                                htmlFor="reject-reason"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Reason for Rejection
                            </label>
                            <textarea
                                id="reject-reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px] mb-4"
                                placeholder="e.g., Patient vitals unstable, further observation required..."
                                aria-required="true"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setView('main')}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => onReject(rejectReason)}
                                    disabled={!rejectReason.trim()}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
