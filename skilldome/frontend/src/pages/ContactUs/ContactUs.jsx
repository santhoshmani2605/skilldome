import { useState } from 'react';
import './ContactUs.css';

// Elements
import heroWoman  from '../../assets/contact-us/elements/hero-woman.png';
import formWoman  from '../../assets/contact-us/elements/form-woman.png';
import mapPreview from '../../assets/contact-us/elements/map-preview.png';

// Icons
import iconEmail    from '../../assets/contact-us/icons/icon-email.png';
import iconPhone    from '../../assets/contact-us/icons/icon-phone.png';
import iconLocation from '../../assets/contact-us/icons/icon-location.png';

const MAPS_URL =
  'https://maps.google.com/?q=Skilldome,11/4,Pooja+Garden,Kalapatti+Road,Civil+Aerodrome,Coimbatore';

const contactCards = [
  { icon: iconEmail,    alt: 'Email',    title: 'Email',    detail: 'Info.Skilldomecareers@Gmail.Com' },
  { icon: iconPhone,    alt: 'Phone',    title: 'Phone',    detail: '+91 925910645' },
  { icon: iconLocation, alt: 'Location', title: 'Location', detail: '11/4, Pooja Garden, Kalapatti Road, Civil Aerodrome, Coimbatore' },
];

function Popup({ type, message, onClose }) {
  if (!message) return null;

  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    },
    box: {
      backgroundColor: '#fff', borderRadius: '12px', padding: '36px 40px',
      maxWidth: '420px', width: '90%', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      borderTop: `5px solid ${type === 'success' ? '#22c55e' : type === 'duplicate' ? '#3b82f6' : '#ef4444'}`,
    },
    icon: {
      fontSize: '48px', marginBottom: '12px',
    },
    title: {
      fontSize: '20px', fontWeight: '700', marginBottom: '8px',
      color: type === 'success' ? '#16a34a' : type === 'duplicate' ? '#2563eb' : '#dc2626',
    },
    message: {
      fontSize: '15px', color: '#555', marginBottom: '24px', lineHeight: '1.5',
    },
    btn: {
      padding: '10px 28px', borderRadius: '8px', border: 'none',
      cursor: 'pointer', fontWeight: '600', fontSize: '15px', color: '#fff',
      backgroundColor: type === 'success' ? '#22c55e' : type === 'duplicate' ? '#3b82f6' : '#ef4444',
    },
  };

  const icon   = type === 'success' ? '✅' : type === 'duplicate' ? 'ℹ️' : '❌';
  const title  = type === 'success' ? 'Form Submitted Successfully!' : type === 'duplicate' ? 'Already Submitted!' : 'Please Fix the Errors';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.box} onClick={(e) => e.stopPropagation()}>
        <div style={styles.icon}>{icon}</div>
        <div style={styles.title}>{title}</div>
        <div style={styles.message}>{message}</div>
        <button style={styles.btn} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

function ContactUs() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [popup, setPopup]     = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // --- Frontend validation ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name.trim()) {
      return setPopup({ type: 'error', message: 'Please enter your name.' });
    }
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      return setPopup({ type: 'error', message: 'Please enter a valid email address.' });
    }
    if (!form.message.trim()) {
      return setPopup({ type: 'error', message: 'Please enter your message.' });
    }

    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.status === 'success') {
        setPopup({ type: 'success', message: 'Your message has been received. Our team will get back to you soon!' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else if (data.status === 'duplicate') {
        setPopup({ type: 'duplicate', message: 'This email has already been used to submit a message. We will get back to you soon!' });
      } else {
        setPopup({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setPopup({ type: 'error', message: 'Unable to reach the server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cu-page">

      {/* Popup */}
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: '' })}
      />

      {/* ── Section 1: Hero ── */}
      <section className="cu-hero">
        <div className="cu-hero__inner">
          <div className="cu-hero__image-wrap">
            <img src={heroWoman} alt="Woman breaking through paper" className="cu-hero__image" />
          </div>
          <div className="cu-hero__text">
            <p className="cu-hero__tagline">Let's Talk<br />About Your</p>
            <div className="cu-hero__badge">
              <span className="cu-hero__badge-text">Careers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Contact Info Cards ── */}
      <section className="cu-info">
        <div className="cu-info__inner">
          <div className="cu-info__header">
            <h2 className="cu-info__heading">Let's Talk About Your Career</h2>
            <p className="cu-info__subtext">
              Have a question about a career path, our programs, or a college
              partnership? Send us a message and our team will get back to you.
            </p>
          </div>
          <div className="cu-info__cards">
            {contactCards.map((card) => (
              <div className="cu-info__card" key={card.title}>
                <img src={card.icon} alt={card.alt} className="cu-info__icon" />
                <p className="cu-info__card-title">{card.title}</p>
                <p className="cu-info__card-detail">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Contact Form ── */}
      <section className="cu-form-section" id="contact-form">
        <div className="cu-form-section__inner">
          <div className="cu-form-wrap">
            <div className="cu-field">
              <label className="cu-label">Your name</label>
              <input className="cu-input" type="text" name="name" placeholder="Abc" value={form.name} onChange={handleChange} />
            </div>
            <div className="cu-field">
              <label className="cu-label">Email address</label>
              <input className="cu-input" type="email" name="email" placeholder="Abc@def.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="cu-field">
              <label className="cu-label">Subject</label>
              <input className="cu-input" type="text" name="subject" placeholder="This is an optional" value={form.subject} onChange={handleChange} />
            </div>
            <div className="cu-field">
              <label className="cu-label">Message</label>
              <textarea className="cu-textarea" name="message" placeholder="Hi I'd like to ask about" value={form.message} onChange={handleChange}></textarea>
            </div>
            <button className="cu-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          <div className="cu-form-image-wrap">
            <img src={formWoman} alt="Woman with notepad" className="cu-form-woman" />
          </div>
        </div>
      </section>

      {/* ── Section 4: Visit Our Office ── */}
      <section className="cu-map-section">
        <div className="cu-map-section__inner">
          <h2 className="cu-map__heading">Visit Our Office</h2>
          <a className="cu-map__wrap" href={MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="Open SkillDome location in Google Maps">
            <img src={mapPreview} alt="SkillDome Office Location" className="cu-map__img" />
            <div className="cu-map__badge">
              <span className="cu-map__badge-dot">📍</span>
              Open in Google Maps
            </div>
          </a>
        </div>
      </section>

    </div>
  );
}

export default ContactUs;
