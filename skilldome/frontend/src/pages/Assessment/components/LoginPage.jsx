import React, { useState } from 'react';
import { Mail, Lock, Code, Briefcase, ArrowRight, Eye, EyeOff, Compass, CheckCircle2, ArrowLeft } from 'lucide-react';
import logoImg from '../../../assets/assessment/logo.final.png';
import { getUserByEmail } from '../../../services/authService';

export default function LoginPage({ onNext, onGoToRegister, onGoToForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [interestType, setInterestType] = useState(''); // 'coding' | 'non-coding'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Please enter your email address';
    if (!password.trim()) errs.password = 'Please enter your password';
    if (!interestType) errs.interestType = 'Please select your assessment stream';
    return errs;
  };

  const handleLogin = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const storedUser = getUserByEmail(email.trim().toLowerCase());
    
    if (!storedUser) {
      setErrors({ email: 'No account found with this email' });
      return;
    }

    if (storedUser.password !== password) {
      setErrors({ password: 'Incorrect password' });
      return;
    }

    // Pass merged info forward
    onNext({
      ...storedUser,
      interestType
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '36px 20px',
      color: '#0f172a'
    }}>
      
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
          title="Go Back to Home"
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ padding: '48px 42px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px', marginTop: '-10px' }}>
            <img 
              src={logoImg} 
              alt="SkillDome Logo" 
              style={{
                height: 'auto',
                width: '100%',
                maxWidth: '380px',
                maxHeight: '160px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 16px rgba(79, 70, 229, 0.2))'
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Compass size={20} color="#4f46e5" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#4f46e5' }}>
                Welcome Back
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Sign In to Continue
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Log in and choose your track to start your assessment.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 48px',
                    borderRadius: '12px',
                    border: errors.email ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155' }}>
                  Password
                </label>
                <span 
                  onClick={onGoToForgotPassword}
                  style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </span>
              </div>
              
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                  style={{
                    width: '100%',
                    padding: '13px 48px 13px 48px',
                    borderRadius: '12px',
                    border: errors.password ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.password}</p>}
            </div>

            {/* Stream Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Choose Your Assessment Track
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                <div
                  onClick={() => { setInterestType('coding'); setErrors(prev => ({...prev, interestType: ''})); }}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: interestType === 'coding' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: interestType === 'coding' ? 'linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)' : '#f8fafc',
                    boxShadow: interestType === 'coding' ? '0 4px 14px rgba(79, 70, 229, 0.15)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Code size={22} color={interestType === 'coding' ? '#4f46e5' : '#64748b'} />
                    {interestType === 'coding' && <CheckCircle2 size={18} color="#4f46e5" />}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: interestType === 'coding' ? '#4f46e5' : '#0f172a' }}>Coding</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Software & Programming</p>
                </div>

                <div
                  onClick={() => { setInterestType('non-coding'); setErrors(prev => ({...prev, interestType: ''})); }}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: interestType === 'non-coding' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: interestType === 'non-coding' ? 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)' : '#f8fafc',
                    boxShadow: interestType === 'non-coding' ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Briefcase size={22} color={interestType === 'non-coding' ? '#0284c7' : '#64748b'} />
                    {interestType === 'non-coding' && <CheckCircle2 size={18} color="#0284c7" />}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: interestType === 'non-coding' ? '#0284c7' : '#0f172a' }}>Non-Coding</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Aptitude & Core Topics</p>
                </div>

              </div>
              {errors.interestType && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>{errors.interestType}</p>}
            </div>

            <button
              onClick={handleLogin}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.02rem',
                fontWeight: 800,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '10px',
                boxShadow: '0 8px 25px rgba(79, 70, 229, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <span>Explore Assessment Console</span>
              <ArrowRight size={20} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <span 
                  onClick={onGoToRegister}
                  style={{ color: '#4f46e5', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign Up
                </span>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
