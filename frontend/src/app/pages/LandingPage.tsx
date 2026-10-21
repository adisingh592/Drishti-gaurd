import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import UploadAnalyze from '../components/landing/UploadAnalyze';
import LiveDetection from '../components/landing/LiveDetection';
import ThreatDetection from '../components/landing/ThreatDetection';
import CrowdDensity from '../components/landing/CrowdDensity';
import Dashboard from '../components/landing/Dashboard';
import Stats from '../components/landing/Stats';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

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
