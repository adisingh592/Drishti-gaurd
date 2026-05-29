import Navbar from './landing-components/Navbar';
import Hero from './landing-components/Hero';
import Features from './landing-components/Features';
import UploadAnalyze from './landing-components/UploadAnalyze';
import LiveDetection from './landing-components/LiveDetection';
import ThreatDetection from './landing-components/ThreatDetection';
import CrowdDensity from './landing-components/CrowdDensity';
import Dashboard from './landing-components/Dashboard';
import Stats from './landing-components/Stats';
import Testimonials from './landing-components/Testimonials';
import Pricing from './landing-components/Pricing';
import FAQ from './landing-components/FAQ';
import Contact from './landing-components/Contact';
import Footer from './landing-components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden relative">
      <Navbar />
      <Hero />
      <Features />
      <UploadAnalyze />
      <LiveDetection />
      <ThreatDetection />
      <CrowdDensity />
      <Dashboard />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
