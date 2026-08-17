import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ProctorWarningModal({ isOpen, warningCount, maxWarnings = 3, onDismiss, onCloseLogin }) {
  if (!isOpen) return null;

  const isFinalWarning = warningCount >= maxWarnings;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content animate-fade-in" style={{
        padding: '32px',
        maxWidth: '520px',
        border: '2px solid var(--accent-danger)',
        boxShadow: '0 25px 60px rgba(239, 68, 68, 0.25)'
      }}>
        
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            color: 'var(--accent-danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <ShieldAlert size={36} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-danger)', margin: 0 }}>
            Proctoring Alert: Tab Switch Detected!
          </h3>
        </div>

        {/* Warning Details */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Warning <span style={{ color: 'var(--accent-danger)', fontSize: '1.1rem' }}>{warningCount}</span> of {maxWarnings}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
            Navigating away from the assessment window, switching tabs, or minimizing the browser is strictly prohibited during the examination.
          </p>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
            {isFinalWarning ? (
              <>
                <div style={{ color: 'var(--accent-danger)', fontWeight: 800, fontSize: '0.9rem' }}>
                  Maximum warnings reached. Submitting assessment now...
                </div>
                <button
                  type="button"
                  onClick={onCloseLogin}
                  className="btn btn-secondary"
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                  }}
                >
                  Close &amp; Go to Login
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onDismiss}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                }}
              >
                <span>I Understand - Return to Test</span>
                <ArrowRight size={18} />
              </button>
            )}
        </div>

      </div>
    </div>
  );
}
