import { Link } from 'react-router-dom';
import './Footer.css';
import logo          from '../../assets/shared/logo/skilldome-logo-full.png';
import iconInstagram from '../../assets/shared/icons/social-instagram.png';
import iconFacebook  from '../../assets/shared/icons/social-facebook.png';
import iconGmail     from '../../assets/shared/icons/social-gmail.png';
import iconTwitter   from '../../assets/shared/icons/social-twitter.png';

const socials = [
  {
    icon: iconInstagram,
    alt: 'Instagram',
    href: 'https://www.instagram.com/skilldome.careers?igsh=MWlmb2R6cDBjOW1rYQ==',
    external: true,
  },
  {
    icon: iconFacebook,
    alt: 'Facebook',
    href: 'https://www.facebook.com/share/1GY6XfDq3z/?mibextid=wwXIfr',
    external: true,
  },
  {
    icon: iconGmail,
    alt: 'Email',
    href: 'mailto:info.skilldomecareers@gmail.com',
    external: false,
  },
  {
    icon: iconTwitter,
    alt: 'Twitter / X',
    href: 'https://x.com/SKILLDOMECAREER',
    external: true,
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* Top Row — Logo + Social Icons */}
        <div className="footer__top">
          <Link to="/" className="footer__logo">
            <img src={logo} alt="SkillDome – Campus to Corporate" />
          </Link>

          <div className="footer__socials">
            {socials.map((s) => (
              <a
                key={s.alt}
                href={s.href}
                className="social-icon"
                aria-label={s.alt}
                {...(s.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <img src={s.icon} alt={s.alt} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider" />

        {/* Bottom Grid — 4 columns */}
        <div className="footer__grid">

          {/* Col 1 — Legal Links */}
          <div className="footer__col">
            <Link to="/disclaimer"        className="footer__legal-link">Disclaimer</Link>
            <Link to="/terms-of-service"  className="footer__legal-link">Terms of Service</Link>
            <Link to="/privacy-policy"    className="footer__legal-link">Privacy Policy</Link>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="footer__col">
            <p className="footer__col-title">Quick Links</p>
            <Link to="/"            className="footer__link">Home</Link>
            <Link to="/what-we-do"  className="footer__link">What we do</Link>
            <Link to="/contact-us"  className="footer__link">Contact us</Link>
          </div>

          {/* Col 3 — Contact */}
          <div className="footer__col">
            <a href="mailto:info.skilldomecareers@gmail.com" className="footer__link">
              info.skilldomecareers@gmail.com
            </a>
            <a href="tel:+918925910647" className="footer__link">
              +91 8925910647
            </a>
          </div>

          {/* Col 4 — Address */}
          <div className="footer__col">
            <p className="footer__address">
              11/4,pooja garden,kalapatti<br />
              road,civil aerodrome,<br />
              coimbatore - 641014.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
