import React from 'react';
import { Timer, CheckCircle2 } from 'lucide-react';
import logoImg from '../UI/logo.final.png';

export default function Header({ 
  timeLeft,
  totalQuestions, 
  answeredCount, 
  score,
  totalPossibleMarks 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={logoImg} 
            alt="SkillDome Logo" 
            style={{ height: '52px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' }} 
          />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
              SkillDome
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              Official Assessment Portal
            </span>
          </div>
        </div>

        {/* Realtime Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="var(--accent-secondary)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Answered</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {answeredCount} <span style={{ color: 'var(--text-dim)' }}>/ {totalQuestions}</span>
              </span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div style={{
            background: 'rgba(79, 70, 229, 0.08)',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            padding: '8px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Timer size={18} color="var(--accent-primary)" />
            <span style={{ fontFamily: 'var(--font-code)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-primary)' }}>
              {formatTime(timeLeft)}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
