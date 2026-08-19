import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/shared/logo/skilldome-logo-full.png';

const JOIN_FORM_URL = '/assessment';

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  /* ── Dynamic page title ── */
  useEffect(() => {
    const titles = {
      '/':                  'SkillDome - Home Page',
      '/about-us':          'SkillDome - About Us',
      '/what-we-do':        'SkillDome - What We Do',
      '/contact-us':        'SkillDome - Contact Us',
      '/disclaimer':        'SkillDome - Disclaimer',
      '/terms-of-service':  'SkillDome - Terms of Service',
      '/privacy-policy':    'SkillDome - Privacy Policy',
    };
    document.title = titles[location.pathname] || 'SkillDome';
  }, [location]);

  /* ── Close menu on route change ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    function handleOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  /* ── Lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link';

  return (
    <header className="header" ref={navRef}>
      <div className="header__container">

        {/* Logo */}
        <NavLink to="/" className="header__logo">
          <img src={logo} alt="SkillDome – Campus to Corporate" />
        </NavLink>

        {/* Nav — desktop inline / mobile dropdown */}
        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <NavLink to="/"           className={navClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about-us"   className={navClass}     onClick={() => setMenuOpen(false)}>About us</NavLink>
          <NavLink to="/what-we-do" className={navClass}     onClick={() => setMenuOpen(false)}>What we do</NavLink>
          <NavLink to="/contact-us" className={navClass}     onClick={() => setMenuOpen(false)}>Contact us</NavLink>

          {/* CTA inside mobile dropdown */}
          <NavLink
            to={JOIN_FORM_URL}
            className="header__cta header__cta--mobile"
            onClick={() => setMenuOpen(false)}
          >
            Start your assessment
          </NavLink>
        </nav>

        {/* Desktop CTA */}
        <NavLink
          to={JOIN_FORM_URL}
          className="header__cta header__cta--desktop"
        >
          Start your assessment
        </NavLink>

        {/* Hamburger */}
        <button
          className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  );
}

export default Header;

