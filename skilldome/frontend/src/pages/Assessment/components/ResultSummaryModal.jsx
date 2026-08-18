import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ResultSummaryModal({ isOpen, onClose, results, onRestart }) {
  if (!isOpen || !results) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: '460px' }}>
        
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CheckCircle2 size={40} color="var(--accent-success)" />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
          Assessment Submitted
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '8px' }}>
          Your answers have been successfully submitted.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Thank you for completing the assessment. Your responses have been recorded and sent for review.
        </p>

        {/* Sync Status */}
        {results.syncStatus && (
          <div style={{
            marginTop: '24px',
            background: results.syncStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${results.syncStatus.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: results.syncStatus.success ? '#34d399' : '#f87171'
          }}>
            <CheckCircle2 size={16} />
            <span>{results.syncStatus.success ? 'Responses saved successfully' : 'Could not save — please contact administrator'}</span>
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
