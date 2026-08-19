import React from 'react';
import { X, CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';

export default function QuestionPalette({
  isOpen,
  onClose,
  questions,
  currentIndex,
  onSelectQuestion,
  userAnswers,
  reviewFlags
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '380px',
          height: '100vh',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px'
        }}
      >
        {/* Drawer Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Question Palette</h3>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Status Legend */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            background: 'var(--bg-input)',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-success)' }} />
              <span>Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-warning)' }} />
              <span>Flagged</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#cbd5e1' }} />
              <span>Not Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid var(--accent-primary)', background: 'transparent' }} />
              <span>Current</span>
            </div>
          </div>

          {/* Questions Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            maxHeight: 'calc(100vh - 220px)',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = Boolean(userAnswers[q.id]);
              const isFlagged = Boolean(reviewFlags[q.id]);

              let bgColor = '#f1f5f9';
              let textColor = 'var(--text-muted)';
              let borderColor = 'var(--border-color)';

              if (hasAnswer) {
                bgColor = '#d1fae5';
                textColor = '#047857';
                borderColor = '#10b981';
              } else if (isFlagged) {
                bgColor = '#fef3c7';
                textColor = '#b45309';
                borderColor = '#f59e0b';
              }

              if (isCurrent) {
                borderColor = 'var(--accent-primary)';
                if (!hasAnswer && !isFlagged) {
                  bgColor = '#e0e7ff';
                  textColor = '#4338ca';
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    color: textColor,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'var(--transition)'
                  }}
                >
                  {q.sNo || idx + 1}
                  {isFlagged && (
                    <div style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--accent-warning)'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%' }}>
          Back to Question
        </button>
      </div>
    </div>
  );
}
