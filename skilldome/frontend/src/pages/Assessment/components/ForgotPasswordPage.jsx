import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, KeyRound, Compass, ArrowLeft } from 'lucide-react';
import logoImg from '../../../assets/assessment/logo.final.png';
import { getUserByEmail, saveUser } from '../../../services/authService';
import { sendOTPToGoogleSheet } from '../../../services/googleSheetService';

export default function ForgotPasswordPage({ onGoToLogin }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Please enter your registered email' });
      return;
    }
    
    const user = getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      setErrors({ email: 'No account found with this email address' });
      return;
    }

    setIsSending(true);
    // Generate random 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    // Send OTP via Google Sheet Backend
    const response = await sendOTPToGoogleSheet(email, code);
    setIsSending(false);
    
    if (response.success) {
      setErrors({});
      setStep(2);
    } else {
      setErrors({ email: 'Failed to send OTP. Please try again later.' });
    }
  };

  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the OTP' });
      return;
    }
    
    if (otp !== generatedOtp) {
      setErrors({ otp: 'Invalid OTP entered' });
      return;
    }

    setErrors({});
    setStep(3);
  };

  const handleResetPassword = () => {
    const errs = {};
    if (!newPassword.trim()) errs.password = 'Please enter a new password';
    else if (newPassword.length < 4) errs.password = 'Password must be at least 4 characters';
    
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const user = getUserByEmail(email.trim().toLowerCase());
    if (user) {
      user.password = newPassword;
      saveUser(email.trim().toLowerCase(), user);
      alert('Password reset successfully!');
      onGoToLogin();
    }
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
              <ShieldCheck size={20} color="#4f46e5" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#4f46e5' }}>
                Account Recovery
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {step === 1 ? 'Enter your registered email address to receive an OTP.' : 
               step === 2 ? 'Enter the 6-digit code sent to your email.' : 
               'Enter your new password to secure your account.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {step === 1 && (
              <>
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
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
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
                
                <button
                  onClick={handleSendOTP}
                  disabled={isSending}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.02rem',
                    fontWeight: 800,
                    borderRadius: '14px',
                    background: isSending ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: isSending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '10px',
                    boxShadow: isSending ? 'none' : '0 8px 25px rgba(79, 70, 229, 0.35)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>{isSending ? 'Sending OTP...' : 'Send OTP'}</span>
                  {!isSending && <ArrowRight size={20} />}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                    6-Digit OTP
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setErrors({}); }}
                      style={{
                        width: '100%',
                        padding: '13px 16px 13px 48px',
                        borderRadius: '12px',
                        border: errors.otp ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        background: '#f8fafc',
                        color: '#0f172a',
                        fontSize: '1.2rem',
                        letterSpacing: '4px',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>
                  {errors.otp && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.otp}</p>}
                </div>
                
                <button
                  onClick={handleVerifyOTP}
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
                  <span>Verify OTP</span>
                  <CheckCircle2 size={20} />
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }}
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
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                      style={{
                        width: '100%',
                        padding: '13px 16px 13px 48px',
                        borderRadius: '12px',
                        border: errors.confirmPassword ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        background: '#f8fafc',
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>
                  {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.confirmPassword}</p>}
                </div>
                
                <button
                  onClick={handleResetPassword}
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
                  <span>Reset Password</span>
                  <CheckCircle2 size={20} />
                </button>
              </>
            )}

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Remember your password?{' '}
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
