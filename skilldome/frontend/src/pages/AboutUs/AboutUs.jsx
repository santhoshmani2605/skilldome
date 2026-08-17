import './AboutUs.css';

import heroImage    from '../../assets/about-us/elements/hero-image.png';
import storyImage   from '../../assets/about-us/elements/story-image.png';
import teamImage    from '../../assets/about-us/elements/team-image.png';
import statsPeople  from '../../assets/about-us/elements/stats-people.png';
import visionIcon   from '../../assets/about-us/icons/vision-icon.png';
import missionIcon  from '../../assets/about-us/icons/mission-icon.png';

function AboutUs() {
  return (
    <div className="about-page">

      {/* ══ HERO ══ */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <div className="about-hero__content">
            <h1 className="about-hero__title">Building Future Professionals !</h1>
            <p className="about-hero__desc">
              We bridge the gap between education and industry by providing
              personalized guidance, practical learning, and career-focused mentorship.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeklo1USzC8duVtiKnkexChwHxxkk1fJbSpFPKHCUs7ULxQvw/viewform?pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="about-hero__btn"
            >Book Free Career Session →</a>
          </div>
          <div className="about-hero__image-wrap">
            <img src={heroImage} alt="Excited student" />
          </div>
        </div>
      </section>

      {/* ══ OUR STORY ══ */}
      <section className="about-story">
        <div className="about-story__img-wrap">
          <img src={storyImage} alt="Team in collaborative workspace" />
        </div>
        <div className="about-story__text">
          <h2 className="about-story__title">Our Story</h2>
          <p className="about-story__desc">
            SkillDome was founded with a vision to bridge the gap between academic
            learning and industry expectations. We guide students in choosing the
            right career path through personalized mentorship, practical learning
            roadmaps, and industry-focused training. Our goal is to help every
            student build confidence, develop in-demand skills, and become
            career-ready. At SkillDome, we believe the right guidance can transform
            aspirations into successful careers.
          </p>
        </div>
      </section>

      {/* ══ VISION & MISSION ══ */}
      <section className="about-vm">
        <div className="about-vm__card">
          <div className="about-vm__icon">
            <img src={visionIcon} alt="Vision icon" />
          </div>
          <h3 className="about-vm__heading">Vision</h3>
          <p className="about-vm__text">
            To Empower Every Student With The Right Guidance To Achieve A Successful
            IT Career. Helping Them Build Successful And Fulfilling Careers In The IT
            Industry. Building A Future Where Every Student Can Reach Their Full
            Potential.
          </p>
        </div>
        <div className="about-vm__card">
          <div className="about-vm__icon">
            <img src={missionIcon} alt="Mission icon" />
          </div>
          <h3 className="about-vm__heading">Mission</h3>
          <p className="about-vm__text">
            To Bridge The Gap Between Academic Learning And Industry Expectations.
            Providing Personalized Career Guidance And Expert Mentorship. Supporting
            Every Learner In Achieving Long-Term Professional Success.
          </p>
        </div>
      </section>

      {/* ══ OUR TEAM ══ */}
      <section className="about-team">
        <div className="about-team__text">
          <h2 className="about-team__title">Our Team</h2>
          <p className="about-team__desc">
            Our team is made up of passionate mentors and industry professionals
            dedicated to student success. We work together to provide expert
            guidance, practical insights, and personalized support. Our mission is
            to help every student confidently achieve their career goals.
          </p>
        </div>
        <div className="about-team__img-wrap">
          <img src={teamImage} alt="SkillDome team members" />
        </div>
      </section>

      {/* ══ STATS BANNER ══ */}
      <div className="about-stats-wrapper">
        <section className="about-stats">
          <div className="about-stats__left">
            <div className="about-stats__text">
              <h2 className="about-stats__title">
                Thousands Of <span>Students</span><br />
                Guided Toward Their<br />
                Dream Careers
              </h2>
            </div>
            <div className="about-stats__nums-row">
              <div className="about-stats__item">
                <div className="about-stats__num">1.2K+</div>
                <div className="about-stats__lbl">Students Guided</div>
              </div>
              <div className="about-stats__divider" />
              <div className="about-stats__item">
                <div className="about-stats__num">92%</div>
                <div className="about-stats__lbl">Student Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="about-stats__people">
            <img src={statsPeople} alt="Happy students" />
          </div>
        </section>
      </div>

    </div>
  );
}

export default AboutUs;
