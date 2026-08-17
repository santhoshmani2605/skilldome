import React, { useState } from 'react';
import { Zap, BookOpen, Flame, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  {
    id: 'Basic',
    title: 'Basic',
    subtitle: 'Foundation Level',
    description: 'Fundamental concepts, syntax basics, and simple problem solving.',
    icon: BookOpen,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  {
    id: 'Inter',
    title: 'Intermediate',
    subtitle: 'Skill Building',
    description: 'Applied concepts, data structures, and moderate complexity problems.',
    icon: Zap,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  {
    id: 'Advance',
    title: 'Expert',
    subtitle: 'Advanced Level',
    description: 'Complex algorithms, system design, and challenging problem solving.',
    icon: Flame,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  }
];

export default function ChooseTypePage({ candidateName, onNext, onBack }) {
  const [selected, setSelected] = useState(null);

  const handleStart = () => {
    if (!selected) return;
    onNext(selected);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
            Hi {candidateName}! 👋
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Choose your assessment difficulty level
          </p>
        </div>

        {/* Difficulty Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            const IconComponent = opt.icon;
            
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  background: isSelected ? opt.bgColor : 'var(--bg-card)',
                  border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  position: 'relative',
                  boxShadow: isSelected ? `0 4px 20px ${opt.borderColor}` : 'none'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: opt.bgColor,
                  border: `1px solid ${opt.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComponent size={24} color={opt.color} />
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {opt.title}
                    </h3>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: '20px',
                      background: opt.bgColor,
                      color: opt.color,
                      border: `1px solid ${opt.borderColor}`
                    }}>
                      {opt.subtitle}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {opt.description}
                  </p>
                </div>

                {/* Selected Check */}
                {isSelected && (
                  <CheckCircle2 size={24} color={opt.color} style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="glass-panel" style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            flexShrink: 0
          }} />
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            You will receive <strong style={{ color: 'var(--text-main)' }}>5 random questions</strong> from the selected difficulty level. Time limit: <strong style={{ color: 'var(--text-main)' }}>45 minutes</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary"
            style={{
              padding: '14px 24px',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <button
            onClick={handleStart}
            disabled={!selected}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: selected ? 1 : 0.5
            }}
          >
            <span>Start Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
