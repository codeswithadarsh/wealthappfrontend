import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const useCustomToast = () => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((type, message) => {

        setToast({ type, message, id: Date.now() });
    }, []);

    const hideToast = useCallback(() => setToast(null), []);

    const ToastComponent = toast ? (
        <ToastUI
            type={toast.type}
            message={toast.message}
            onClose={hideToast}
            key={toast.id}
        />
    ) : null;

    return { showToast, ToastComponent };
};

const ToastUI = ({ type, message, onClose }) => {
    const [progress, setProgress] = useState(100);
    const duration = 3000;

    const config = {
        success: { icon: <CheckCircle2 size={20} color="#10b981" />, bar: '#10b981', border: '#10b98133' },
        error: { icon: <XCircle size={20} color="#ef4444" />, bar: '#ef4444', border: '#ef444433' },
        warning: { icon: <AlertCircle size={20} color="#f59e0b" />, bar: '#f59e0b', border: '#f59e0b33' },
        info: { icon: <Info size={20} color="#3b82f6" />, bar: '#3b82f6', border: '#3b82f633' },
    }[type] || { icon: <Info size={20} color="#3b82f6" />, bar: '#3b82f6', border: '#3b82f633' };

    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        const interval = setInterval(() => {
            setProgress((p) => Math.max(0, p - (100 / (duration / 10))));
        }, 10);
        return () => { clearTimeout(timer); clearInterval(interval); };
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999999999,
            width: 'max-content',
            minWidth: '320px',
            maxWidth: '90vw',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${config.border}`,
            overflow: 'hidden',
            animation: 'toast-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            marginTop: '70px'
        }}>
            <style>{`
       @keyframes toast-slide-up {
  from { transform: translate(-50%, 20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
      `}</style>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 18px',
                gap: '14px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {config.icon}
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        letterSpacing: '-0.01em'
                    }}>
                        {message}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        display: 'flex',
                        borderRadius: '6px',
                        transition: 'background 0.2s, color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#4b5563';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9ca3af';
                    }}
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
            </div>

            {/* Progress Bar Container */}
            <div style={{
                height: '3px',
                width: '100%',
                backgroundColor: '#f3f4f6',
                position: 'relative'
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: config.bar,
                    transition: 'width 0.1s linear',
                    borderTopRightRadius: '2px',
                    borderBottomRightRadius: '2px'
                }} />
            </div>
        </div>
    );
};