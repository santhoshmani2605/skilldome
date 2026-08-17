import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Assets — Hero
import heroRight    from '../../assets/home/elements/hero-right.png';
import dreamBadge  from '../../assets/home/elements/dream-badge.png';

// Assets — About
import studentImg     from '../../assets/home/elements/student-image.png';
import itBadge        from '../../assets/home/elements/it-careers-badge.png';
import checkIcon      from '../../assets/home/icons/check-icon.png';

// Assets — Campus to Corporate
import campusImg      from '../../assets/home/elements/campus-image.png';
import corporateImg   from '../../assets/home/elements/corporate-image.png';

// Assets — Why Choose
import iconCareer     from '../../assets/home/icons/icon-career-guidance.png';
import iconSkill      from '../../assets/home/icons/icon-skill-development.png';
import iconRoadmap    from '../../assets/home/icons/icon-learning-roadmaps.png';
import iconResume     from '../../assets/home/icons/icon-resume-portfolio.png';
import iconInterview  from '../../assets/home/icons/icon-interview-prep.png';
import iconPlacement  from '../../assets/home/icons/icon-placement.png';
import iconSparkle    from '../../assets/home/icons/icon-sparkle.png';

// Assets — Steps
import step1Icon from '../../assets/home/icons/step-1-icon.png';
import step2Icon from '../../assets/home/icons/step-2-icon.png';
import step3Icon from '../../assets/home/icons/step-3-icon.png';
import step4Icon from '../../assets/home/icons/step-4-icon.png';
import stepNum1  from '../../assets/home/icons/step-num-1.png';
import stepNum2  from '../../assets/home/icons/step-num-2.png';
import stepNum3  from '../../assets/home/icons/step-num-3.png';
import stepNum4  from '../../assets/home/icons/step-num-4.png';

// Assets — Newsletter
import newsletterPeople from '../../assets/home/elements/newsletter-people.png';
import newsletterArch   from '../../assets/home/elements/newsletter-arch.png';
import newsletterDots   from '../../assets/home/elements/newsletter-dots.png';
import newsletterSwirl  from '../../assets/home/elements/newsletter-swirl.png';

// ── Constants ──
const JOIN_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeklo1USzC8duVtiKnkexChwHxxkk1fJbSpFPKHCUs7ULxQvw/viewform?pli=1';

const aboutBullets = [
  'Personalized Career Guidance & Learning Roadmaps',
  'Industry-Ready Skills with Resume & Interview Preparation',
  'Placement Assistance to Launch Your IT Career',
];

const whyCards = [
  {
    icon: iconCareer,
    title: 'Career Guidance',
    titleColor: '#161439',
    para: 'Get personalized career counseling to identify the right career path based on your interests, strengths, and goals.',
    fill: '#F1FDFF',
    stroke: '#C9E4E9',
  },
  {
    icon: iconSkill,
    title: 'Skill Development',
    titleColor: '#161439',
    para: 'Learn in-demand technical and professional skills through curated roadmaps, practical resources, and expert mentorship.',
    fill: '#EDEAFF',
    stroke: '#C8C1ED',
  },
  {
    icon: iconRoadmap,
    title: 'Learning Roadmaps',
    titleColor: '#161439',
    para: 'Follow clear, step-by-step learning paths designed to help you master the skills required for your dream career.',
    fill: '#FFF1E2',
    stroke: '#EBD3C4',
  },
  {
    icon: iconResume,
    title: 'Resume & Portfolio',
    titleColor: '#161439',
    para: 'Create ATS-friendly resumes and professional portfolios that showcase your skills and make a strong first impression.',
    fill: '#FEFFF1',
    stroke: '#E5E9C9',
  },
  {
    icon: iconInterview,
    title: 'Interview Preparation',
    titleColor: '#161439',
    para: 'Practice aptitude tests, technical interviews, HR interviews, and communication skills to boost your confidence.',
    fill: '#FFEAF7',
    stroke: '#EDC1E7',
  },
  {
    icon: iconPlacement,
    title: 'Placement Assistance',
    titleColor: '#161439',
    para: 'Get guidance on internships, job opportunities, campus placements, and career support to launch your professional journey.',
    fill: '#E2FFED',
    stroke: '#C4EBC9',
  },
];

const stepsData = [
  {
    num: stepNum1,
    icon: step1Icon,
    title: 'Fill the Enquiry Form',
    para: 'Share your details and interests with us.',
  },
  {
    num: stepNum2,
    icon: step2Icon,
    title: 'Choose Your Slot',
    para: 'View available slots and book a convenient time.',
  },
  {
    num: stepNum3,
    icon: step3Icon,
    title: 'Attend Free Session',
    para: 'Get personalized career guidance from experts.',
  },
  {
    num: stepNum4,
    icon: step4Icon,
    title: 'Get Your Roadmap',
    para: 'Receive a tailored learning roadmap to achieve your goals.',
  },
];

function Home() {

  const navigate = useNavigate();

  // Subscribe state
  const [email, setEmail]     = useState('');
  const [popup, setPopup]     = useState(null); // { message, type: 'success' | 'error' | 'info' }
  const [loading, setLoading] = useState(false);

  const showPopup = (message, type) => {
    setPopup({ message, type });
  };

  const handleSubscribe = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showPopup('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        showPopup('You have successfully subscribed to Skilldome Careers. Stay tuned for the latest updates!', 'success');
        setEmail('');
      } else if (data.status === 'already_subscribed') {
        showPopup('This email is already subscribed. You will continue to receive our latest updates!', 'info');
      } else {
        showPopup(data.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showPopup('Something went wrong. Please try again.', 'error');
    }
    setLoading(false);
  };

  // Campus drag slider
  const compareRef       = useRef(null);
  const beforeWrapperRef = useRef(null);
  const sliderLineRef    = useRef(null);
  const isDragging       = useRef(false);

  const setSliderPosition = (x) => {
    const container = compareRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    pos = Math.min(Math.max(pos, 0), 100);
    if (beforeWrapperRef.current) beforeWrapperRef.current.style.width = `${pos}%`;
    if (sliderLineRef.current)    sliderLineRef.current.style.left     = `${pos}%`;
  };

  const startDrag = () => { isDragging.current = true; };
  const stopDrag  = () => { isDragging.current = false; };

  useEffect(() => {
    const container = compareRef.current;
    if (!container) return;
    const updateWidth = () => {
      container.style.setProperty('--container-width', `${container.offsetWidth}px`);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDrag = (e) => {
    if (!isDragging.current) return;
    setSliderPosition(e.clientX);
  };

  const handleTouchDrag = (e) => {
    if (!isDragging.current) return;
    setSliderPosition(e.touches[0].clientX);
  };

  // Popup config
  const popupConfig = {
    success: {
      color:  '#22c55e',
      icon:   '✅',
      title:  'Subscribed Successfully!',
    },
    error: {
      color:  '#ef4444',
      icon:   '❌',
      title:  'Oops!',
    },
    info: {
      color:  '#3b82f6',
      icon:   'ℹ️',
      title:  'Already Subscribed!',
    },
  };

  return (
    <div className="home-page">

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero__container">

          <div className="hero__left">
            <h1 className="hero__heading">
              Discover{' '}
              <span className="hero__dream-wrap">
                <img src={dreamBadge} alt="Your Dream" className="hero__dream-img" />
              </span>
              <br />
              Career With SkillDome
            </h1>

            <p className="hero__para">
              Learn new skills, explore career paths, take career assessments,
              and build your future confidently.
            </p>

            <div className="hero__actions">
              <button
                className="hero__btn-trial"
                onClick={() => {
                  navigate('/contact-us');
                  setTimeout(() => {
                    const formSection = document.querySelector('.cu-form-section');
                    if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Start Free Trial <span className="hero__btn-arrow">&#8594;</span>
              </button>
              <a
                href="https://www.youtube.com/@SKILLDOME.CAREERS"
                target="_blank"
                rel="noopener noreferrer"
                className="hero__video-group"
                aria-label="Watch Our Video on YouTube"
              >
                <span className="hero__play-btn">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="#FFC224"/>
                    <path d="M20 15L34 24L20 33V15Z" fill="#161439"/>
                  </svg>
                </span>
                <span className="hero__video-label">Watch Our<br />Video</span>
              </a>
            </div>
          </div>

          <div className="hero__right">
            <img
              src={heroRight}
              alt="SkillDome Career Guidance"
              className="hero__right-img"
            />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT / GET TO KNOW SECTION
      ════════════════════════════════════════ */}
      <section className="about">
        <div className="about__container">

          <div className="about__left">
            <img src={studentImg} alt="Student — Education System Can Make Change" className="about__student-img" />
          </div>

          <div className="about__right">
            <span className="about__label">Get to Know SkillDome</span>
            <h2 className="about__heading">
              Empowering Students <br />
              For Successful{' '}
              <img src={itBadge} alt="IT Careers" className="about__it-badge" />
            </h2>
            <p className="about__para">
              SkillDome helps college students and aspiring IT professionals become
              industry-ready through expert career guidance and structured learning.
              We bridge the gap between academics and industry with practical
              roadmaps, helping students build real-world skills and confidently
              launch successful IT careers.
            </p>
            <ul className="about__bullets">
              {aboutBullets.map((item, i) => (
                <li key={i} className="about__bullet">
                  <img src={checkIcon} alt="check" className="about__check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          CAMPUS TO CORPORATE SECTION
      ════════════════════════════════════════ */}
      <section className="compare-section">
        <h2 className="campus-title">CAMPUS TO CORPORATE</h2>

        <div
          className="compare-container"
          ref={compareRef}
          onMouseMove={handleDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={handleTouchDrag}
          onTouchEnd={stopDrag}
        >
          <img src={corporateImg} alt="Corporate" className="after" />
          <div className="before-wrapper" ref={beforeWrapperRef}>
            <img src={campusImg} alt="Campus" className="before" />
          </div>
          <div className="slider-line" ref={sliderLineRef}>
            <div
              className="slider-button"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M7 12H17M7 12L10 9M7 12L10 15M17 12L14 9M17 12L14 15"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE SKILLDOME SECTION
      ════════════════════════════════════════ */}
      <section className="why">
        <div className="why__container">

          <div className="why__badge">
            <span className="why__badge-text">WHY CHOOSE SKILLDOME?</span>
          </div>

          <h2 className="why__heading">Build Your Career With SkillDome</h2>

          <p className="why__para">
            Helping students discover the right career path, develop industry-ready
            skills, and confidently prepare for their future.
          </p>

          <div className="why__grid">
            {whyCards.map((card, i) => (
              <div
                key={i}
                className="why__card"
                style={{ background: card.fill, border: `1.5px solid ${card.stroke}` }}
              >
                <div className="why__card-top">
                  <img src={card.icon} alt={card.title} className="why__card-icon" />
                  <h3 className="why__card-title" style={{ color: card.titleColor }}>
                    {card.title}
                  </h3>
                  <img src={iconSparkle} alt="" className="why__card-sparkle" aria-hidden="true" />
                </div>
                <p className="why__card-para">{card.para}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          SIMPLE STEPS SECTION
      ════════════════════════════════════════ */}
      <section className="steps">
        <div className="steps__container">

          <div className="steps__badge">
            <span className="steps__badge-text">Our Top Features</span>
          </div>

          <h2 className="steps__heading">Simple Steps To Get Started</h2>

          <div className="steps__row">
            {stepsData.map((step, i) => (
              <div key={i} className="steps__item">

                <div className="steps__icon-wrap">
                  <img src={step.icon} alt={step.title} className="steps__icon" />
                  <div className="steps__num-wrap">
                    <img src={step.num} alt={`Step ${i + 1}`} className="steps__num" />
                  </div>
                </div>

                {i < stepsData.length - 1 && (
                  <div className="steps__connector">
                    <svg viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6 Q20 0 40 6 Q60 12 80 6" stroke="#C4C4F3" strokeWidth="2" strokeDasharray="5 4" fill="none"/>
                    </svg>
                  </div>
                )}

                <h3 className="steps__title">{step.title}</h3>
                <p className="steps__para">{step.para}</p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          NEWSLETTER SECTION
      ════════════════════════════════════════ */}
      <section className="newsletter">
        <div className="newsletter__container">

          <div className="nl__card">

            <img src={newsletterSwirl} alt="" className="nl__shape nl__shape--swirl" aria-hidden="true" />
            <img src={newsletterDots}  alt="" className="nl__shape nl__shape--dots"  aria-hidden="true" />

            <div className="nl__left">
              <img src={newsletterArch}   alt="" className="nl__arch"   aria-hidden="true" />
              <img src={newsletterPeople} alt="Students" className="nl__people" />
            </div>

            <div className="nl__right">
              <h2 className="nl__heading">
                Explore The{' '}
                <span className="nl__highlight">Latest Learning</span>{' '}
                Paths And{' '}
                <span className="nl__highlight">Career Guidance</span>{' '}
                Resources
              </h2>

              <div className="nl__form">
                <input
                  type="email"
                  placeholder="Type Your E-Mail :"
                  className="nl__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                />
                <button
                  className="nl__subscribe-btn"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CENTERED POPUP NOTIFICATION
      ════════════════════════════════════════ */}
      {popup && (
        <>
          {/* Dark overlay */}
          <div
            onClick={() => setPopup(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
            }}
          />

          {/* Centered popup card */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px 48px',
            minWidth: '320px',
            maxWidth: '420px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            animation: 'popupZoomIn 0.3s ease',
          }}>

            {/* Colored top bar */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '6px',
              borderRadius: '20px 20px 0 0',
              background: popupConfig[popup.type].color,
            }} />

            {/* Icon circle */}
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: `${popupConfig[popup.type].color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '8px auto 18px',
              fontSize: '32px',
            }}>
              {popupConfig[popup.type].icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              color: popupConfig[popup.type].color,
              margin: '0 0 10px',
            }}>
              {popupConfig[popup.type].title}
            </h3>

            {/* Message */}
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14.5px',
              color: '#6B7280',
              margin: '0 0 28px',
              lineHeight: '1.65',
            }}>
              {popup.message}
            </p>

            {/* OK button */}
            <button
              onClick={() => setPopup(null)}
              style={{
                background: popupConfig[popup.type].color,
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                padding: '11px 36px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              OK
            </button>

          </div>
        </>
      )}

      {/* Popup animation */}
      <style>{`
        @keyframes popupZoomIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

    </div>
  );
}

export default Home;
