import React, { useState } from 'react';
import { User, Mail, Lock, Code, Briefcase, ArrowRight, Eye, EyeOff, CheckCircle2, Sparkles, Award, TrendingUp, Compass, Star, Zap, ShieldCheck, Hash, GraduationCap } from 'lucide-react';
import logoImg from '../../UI/logo.final.png';
import { getUserByEmail, saveUser } from '../services/authService';

export default function RegistrationPage({ onNext, initialValues = {} }) {
  const [name, setName] = useState(initialValues.name || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [password, setPassword] = useState(initialValues.password || '');
  const [studentId, setStudentId] = useState(initialValues.studentId || '');
  const [batchId, setBatchId] = useState(initialValues.batchId || '');
  const [showPassword, setShowPassword] = useState(false);
  const [interestType, setInterestType] = useState(initialValues.interestType || ''); // 'coding' | 'non-coding'
  const [errors, setErrors] = useState({});
  // 'register' = new user, 'login' = returning user
  const [authMode, setAuthMode] = useState('register');

  const validate = () => {
    const errs = {};
    if (authMode === 'register') {
      if (!name.trim()) errs.name = 'Please enter your candidate name';
    }
    if (!email.trim()) errs.email = 'Please enter your registered email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address';
    if (authMode === 'register') {
      if (!studentId.trim()) errs.studentId = 'Please enter your Student ID';
      if (!batchId.trim()) errs.batchId = 'Please enter your Batch ID';
    }
    if (!password.trim()) errs.password = 'Please enter your password';
    else if (authMode === 'register' && password.length < 4) errs.password = 'Password must be at least 4 characters';
    if (authMode === 'register' && !interestType) errs.interestType = 'Please select your assessment stream';
    return errs;
  };

  // ⛔ TESTING MODE: Email uniqueness & login DISABLED — say "LOCK" to re-enable
  // TODO: RE-ENABLE FOR PRODUCTION — replace this block with the auth-check version
  const handleContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const userInfo = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      studentId: studentId.trim(),
      batchId: batchId.trim(),
      interestType
    };
    // Skip saving and auth check — allow multiple entries with same email
    onNext(userInfo);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '36px 20px',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(2, 132, 199, 0.08) 0%, transparent 40%), linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
      color: '#0f172a'
    }}>
      
      {/* Outer Container Card - Responsive Grid */}
      <div className="animate-fade-in registration-container-grid">
        
        {/* LEFT PANEL: Inspiring & Motivational Brand Showcase */}
        <div className="registration-panel-left" style={{
          background: 'linear-gradient(160deg, #eef2ff 0%, #f0f9ff 50%, #e0e7ff 100%)',
          padding: '48px 40px',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* Subtle Decorative Ambient Elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            {/* Top Brand Showcase with logo.final.png */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 14px',
                borderRadius: '30px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px'
              }}>
                <Sparkles size={16} color="#4f46e5" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Empowering Talent
                </span>
              </div>

              {/* Logo Presentation using logo.final.png - Large & High Impact */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '24px' }}>
                <img 
                  src={logoImg} 
                  alt="SkillDome Logo" 
                  style={{
                    height: '105px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 25px rgba(79, 70, 229, 0.25))',
                    transition: 'all 0.3s ease'
                  }} 
                />
              </div>

              {/* Motivational Headline */}
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.25', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Unlock Your Potential.<br />
                <span style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Master Your Domain.
                </span>
              </h2>
              <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.6' }}>
                Take the next step in your career journey. Evaluate your technical skills, discover your strengths, and stand out with verified competency ratings.
              </p>
            </div>

            {/* Motivational Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Feature 1 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '14px 18px',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                  flexShrink: 0
                }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Real-time Skill Evaluation
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                    Interactive tests customized to your expertise
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '14px 18px',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                  flexShrink: 0
                }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Adaptive Growth Track
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                    Select difficulty from Easy to Expert level
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '14px 18px',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                  flexShrink: 0
                }}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Instant Score Analytics
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                    Automatic sync with institutional gradebook
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Inspirational Quote Banner */}
          <div style={{
            marginTop: '28px',
            padding: '16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Star size={24} fill="#fbbf24" color="#fbbf24" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: '1.4', margin: 0 }}>
              "Excellence is not an act, but a habit. Begin your evaluation today and showcase your true skill."
            </p>
          </div>

        </div>

        {/* RIGHT PANEL: Sleek & Modern Candidate Form */}
        <div style={{ padding: '48px 42px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Compass size={20} color="#4f46e5" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#4f46e5' }}>
                Candidate Onboarding
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Welcome to SkillDome
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Fill in your details below to start your personalized test session.
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

            {/* Student ID & Batch ID Grid */}
            <div className="responsive-form-grid">
              {/* Student ID */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                  Student ID
                </label>
                <div style={{ position: 'relative' }}>
                  <Hash size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. STU-12345"
                    value={studentId}
                    onChange={(e) => { setStudentId(e.target.value); setErrors(prev => ({...prev, studentId: ''})); }}
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 48px',
                      borderRadius: '12px',
                      border: errors.studentId ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>
                {errors.studentId && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{errors.studentId}</p>}
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
                    placeholder="e.g. BATCH-2026"
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

            {/* Stream Selection (Coding vs Non-Coding) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '8px' }}>
                Choose Your Assessment Track
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                {/* Coding Option */}
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

                {/* Non-Coding Option */}
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

            {/* Submit Button */}
            <button
              onClick={handleContinue}
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

          </div>

        </div>

      </div>
    </div>
  );
}


