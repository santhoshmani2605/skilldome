import { useNavigate } from 'react-router-dom';
import './WhatWeDo.css';

// ── Assets — Hero
import heroWoman       from '../../assets/what-we-do/elements/hero-woman.png';
import confidenceBadge from '../../assets/what-we-do/elements/confidence-badge.png';

// ── Assets — Guidance Cards
import iconUnderstand  from '../../assets/what-we-do/icons/icon-understand-you.png';
import iconPlanning    from '../../assets/what-we-do/icons/icon-career-planning.png';
import iconLearn       from '../../assets/what-we-do/icons/icon-learn-grow.png';
import iconAchieve     from '../../assets/what-we-do/icons/icon-achieve-success.png';
import iconSparkle     from '../../assets/what-we-do/icons/icon-sparkle.png';

// ── Assets — Career Guidance sections
import itImage         from '../../assets/what-we-do/elements/it-career-image.png';
import nonItImage      from '../../assets/what-we-do/elements/nonit-career-image.png';

// ── Data ──────────────────────────────────────────────────────────────────────

const guidanceCards = [
  {
    id: 1,
    icon: iconUnderstand,
    title: 'Understand You',
    desc: "We assess your interests, strengths, skills, and career aspirations to build a clear picture of where you're headed.",
    fill: '#F1FDFF',
    stroke: '#C9E4E9',
  },
  {
    id: 2,
    icon: iconPlanning,
    title: 'Career Planning',
    desc: 'Our experts create a personalized roadmap based on your goals, helping you navigate the right path with clarity.',
    fill: '#EDEAFF',
    stroke: '#C8C1ED',
  },
  {
    id: 3,
    icon: iconLearn,
    title: 'Learn & Grow',
    desc: 'Get guidance on the right skills, certifications, projects, and learning resources to accelerate your growth.',
    fill: '#FFF1E2',
    stroke: '#EBD3C4',
  },
  {
    id: 4,
    icon: iconAchieve,
    title: 'Achieve Success',
    desc: 'Prepare with resume building, interview training, and placement support to confidently begin your career.',
    fill: '#E2FFED',
    stroke: '#C4EBC9',
  },
];

const comparisonRows = [
  {
    focus: 'Starting point',
    traditional: 'Join our course',
    skilldome: 'Discover the right career path for you',
  },
  {
    focus: 'Approach',
    traditional: 'Sells a fixed course, one-size-fits-all',
    skilldome: 'Personalized guidance before any recommendation',
  },
  {
    focus: 'Clarity',
    traditional: 'Assumes you already know what to learn',
    skilldome: 'Explains domain fit, demand, and roadmap first',
  },
  {
    focus: 'Cost',
    traditional: 'Often lakhs, with no guarantee of direction',
    skilldome: 'Focused guidance without expensive guesswork',
  },
  {
    focus: 'Support',
    traditional: 'Ends when the course ends',
    skilldome: 'Mentorship through interviews and beyond',
  },
  {
    focus: 'Outcome focus',
    traditional: 'Certificates',
    skilldome: 'Real skills, portfolio, and interview readiness',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

function WhatWeDo() {
  const navigate = useNavigate();

  const goToContactForm = () => {
    navigate('/contact-us');
    setTimeout(() => {
      const formSection = document.querySelector('.cu-form-section');
      if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="wwd-page">

      {/* ════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════ */}
      <section className="wwd-hero">
        <div className="wwd-hero__container">

          <div className="wwd-hero__right">
            <h1 className="wwd-hero__heading">
              Shape Your <br />
              Career with{' '}
              <span className="wwd-hero__badge-wrap">
                <img src={confidenceBadge} alt="Confidence" className="wwd-hero__badge" />
              </span>
            </h1>
            <p className="wwd-hero__para">
              Your journey to a successful IT career starts with the right
              guidance. We help you choose the best path, master essential
              skills, and achieve your career goals.
            </p>
          </div>

          <div className="wwd-hero__left">
            <img src={heroWoman} alt="Career guidance" className="wwd-hero__woman" />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — OUR CAREER GUIDANCE PROCESS
      ════════════════════════════════════════ */}
      <section className="wwd-process">
        <div className="wwd-process__container">

          <div className="wwd-process__header">
            <h2 className="wwd-process__heading">Our Career Guidance Process</h2>
            <p className="wwd-process__para">
              We follow a structured and personalized approach to help you make
              informed career decisions with confidence. From understanding your
              goals to preparing you for career success, we're with you every
              step of the way.
            </p>
          </div>

          <div className="wwd-process__grid">
            {guidanceCards.map((card) => (
              <div
                key={card.id}
                className="wwd-process__card"
                style={{ background: card.fill, border: `1.5px solid ${card.stroke}` }}
              >
                <div className="wwd-process__card-top">
                  <img src={card.icon} alt={card.title} className="wwd-process__card-icon" />
                  <h3 className="wwd-process__card-title">{card.title}</h3>
                  <img src={iconSparkle} alt="" className="wwd-process__card-sparkle" aria-hidden="true" />
                </div>
                <p className="wwd-process__card-desc">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — IT CAREER GUIDANCE
      ════════════════════════════════════════ */}
      <section className="wwd-it">
        <div className="wwd-it__container">

          <div className="wwd-it__left">
            <img src={itImage} alt="IT Career Guidance" className="wwd-it__image" />
          </div>

          <div className="wwd-it__right">
            <span className="wwd-tag">IT Career Guidance</span>
            <h2 className="wwd-section-heading">Build Your Future In Technology</h2>
            <p className="wwd-section-para">
              The IT industry offers countless career opportunities, but choosing
              the right path is the key to long-term success. SkillDome provides
              personalized career guidance to help students explore various IT
              domains, understand industry requirements, choose the right learning
              path, and prepare for future job opportunities with confidence.
            </p>
            <button className="wwd-btn" onClick={goToContactForm}>
              For More Details &nbsp;→
            </button>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4 — NON-IT CAREER GUIDANCE
      ════════════════════════════════════════ */}
      <section className="wwd-nonit">
        <div className="wwd-nonit__container">

          <div className="wwd-nonit__left">
            <span className="wwd-tag">Non-IT Career Guidance</span>
            <h2 className="wwd-section-heading">Build Your Future Beyond Technology</h2>
            <p className="wwd-section-para">
              At SkillDome, we guide students in exploring promising Non-IT career
              opportunities through expert mentorship and industry demand analysis.
              By understanding current market trends, required skills, and emerging
              career paths in fields like Digital Marketing, Content Creation, HR,
              Finance, and Business, we help students make informed decisions and
              confidently build a successful career.
            </p>
            <button className="wwd-btn" onClick={goToContactForm}>
              For More Details &nbsp;→
            </button>
          </div>

          <div className="wwd-nonit__right">
            <img src={nonItImage} alt="Non-IT Career Guidance" className="wwd-nonit__image" />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5 — COMPARISON TABLE
      ════════════════════════════════════════ */}
      <section className="wwd-compare">
        <div className="wwd-compare__container">

          {/* Section label + heading */}
          <div className="wwd-compare__header">
            <p className="wwd-compare__label">THE DIFFERENCE</p>
            <h2 className="wwd-compare__title">SkillDome vs. Traditional Institutes</h2>
          </div>

          {/* Table card */}
          <div className="wwd-compare__card">

            {/* Header row */}
            <div className="wwd-compare__head">
              <div className="wwd-compare__head-empty"></div>
              <div className="wwd-compare__head-trad">Traditional Institute</div>
              <div className="wwd-compare__head-sd">SkillDome</div>
            </div>

            {/* Data rows */}
            {comparisonRows.map((row, i) => (
              <div key={i} className="wwd-compare__row">
                <div className="wwd-compare__cell wwd-compare__cell--focus">
                  {row.focus}
                </div>
                <div className="wwd-compare__cell wwd-compare__cell--trad">
                  <span className="wwd-compare__cross">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1L9 9M9 1L1 9" stroke="#E53935" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span>{row.traditional}</span>
                </div>
                <div className="wwd-compare__cell wwd-compare__cell--sd">
                  <span className="wwd-compare__tick">
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7.5L10 1" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>{row.skilldome}</span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
}

export default WhatWeDo;
