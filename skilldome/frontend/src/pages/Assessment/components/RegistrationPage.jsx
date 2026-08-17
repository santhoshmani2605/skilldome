import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle2, ArrowRight, Eye, EyeOff, Compass, Hash, GraduationCap, ArrowLeft } from 'lucide-react';
import logoImg from '../../../assets/assessment/logo.final.png';
import { saveUser, getUserByEmail } from '../../../services/authService';

export default function RegistrationPage({ onNext, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [batchId, setBatchId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Please enter your full name';
    
    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    } else if (getUserByEmail(email.trim().toLowerCase())) {
      errs.email = 'This email is already registered. Please log in.';
    }
    
    if (!batchId.trim()) errs.batchId = 'Please enter your Batch ID';
    
    if (!password.trim()) errs.password = 'Please enter a password';
    else if (password.length < 4) errs.password = 'Password must be at least 4 characters';
    
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    
    return errs;
  };

  const handleRegister = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const userInfo = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      batchId: batchId.trim()
    };
    
    // Save user locally
    saveUser(userInfo.email, userInfo);
    
    // Automatically redirect to login
    onGoToLogin();
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
      
      {/* Centered Container Card */}
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '540px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        <button 
          onClick={onGoToLogin}
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
          title="Go Back to Login"
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ padding: '48px 42px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Logo Presentation */}
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
                Candidate Onboarding
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Create an Account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Register below to get started with your assessment journey.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Candidate Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})); }}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 48px',
                    borderRadius: '12px',
                    border: errors.name ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
              {errors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.name}</p>}
            </div>

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

            {/* Batch ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Batch ID
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="BATCH-2026"
                  value={batchId}
                  onChange={(e) => { setBatchId(e.target.value); setErrors(prev => ({...prev, batchId: ''})); }}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 48px',
                    borderRadius: '12px',
                    border: errors.batchId ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
              {errors.batchId && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.batchId}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Password
              </label>
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

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({...prev, confirmPassword: ''})); }}
                  style={{
                    width: '100%',
                    padding: '13px 48px 13px 48px',
                    borderRadius: '12px',
                    border: errors.confirmPassword ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
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
              <span>Create Account</span>
              <ArrowRight size={20} />
            </button>

            {/* Switch to Login */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Already have an account?{' '}
                <span 
                  onClick={onGoToLogin}
                  style={{ color: '#4f46e5', fontWeight: 700, cursor: 'pointer' }}
                >
                  Log In
                </span>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
