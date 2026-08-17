import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import WhatWeDo from './pages/WhatWeDo/WhatWeDo';
import ContactUs from './pages/ContactUs/ContactUs';
import Disclaimer from './pages/Disclaimer/Disclaimer';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import AssessmentPortal from './pages/Assessment/AssessmentPortal';
import './styles/global.css';

function AppContent() {
  const location = useLocation();
  const isAssessment = location.pathname.startsWith('/assessment');

  return (
    <>
      {!isAssessment && <Header />}
      <main>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/about-us"        element={<AboutUs />} />
          <Route path="/what-we-do"      element={<WhatWeDo />} />
          <Route path="/contact-us"      element={<ContactUs />} />
          <Route path="/disclaimer"      element={<Disclaimer />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy"  element={<PrivacyPolicy />} />
          <Route path="/assessment"      element={<AssessmentPortal />} />
        </Routes>
      </main>
      {!isAssessment && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
