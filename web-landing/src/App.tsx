import { Routes, Route, Link } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { Comparison } from "./components/Comparison";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Switcher } from "./components/Switcher";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

function LandingPage() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <Comparison />
      <HowItWorks />
      <Switcher />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}

function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600">
          Your privacy is important to us. This privacy policy explains how we
          collect, use, and protect your personal information when you use
          LogMyDose.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Information We Collect
        </h2>
        <p className="text-gray-600">
          We collect information you provide directly, such as dose logs, health
          metrics, and account information. We also collect usage data to
          improve our services.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p className="text-gray-600">
          Your health data is used to provide personalized insights and track
          your progress. We never sell your personal health information to third
          parties.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Data Security
        </h2>
        <p className="text-gray-600">
          We implement industry-standard security measures to protect your data,
          including encryption in transit and at rest.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Your Rights
        </h2>
        <p className="text-gray-600">
          You can export or delete your data at any time. Your data belongs to
          you, and you have full control over it.
        </p>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Terms of Service
      </h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600">
          By using LogMyDose, you agree to these terms of service. Please read
          them carefully.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Medical Disclaimer
        </h2>
        <p className="text-gray-600">
          LogMyDose is a tracking tool and does not provide medical advice.
          Always consult with your healthcare provider about your treatment.
          AI-generated insights are for informational purposes only and should
          not replace professional medical guidance.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          User Responsibilities
        </h2>
        <p className="text-gray-600">
          You are responsible for maintaining the accuracy of your logged data
          and the security of your account credentials.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Service Availability
        </h2>
        <p className="text-gray-600">
          We strive to maintain high availability but do not guarantee
          uninterrupted service. We reserve the right to modify or discontinue
          features with notice.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Data Ownership
        </h2>
        <p className="text-gray-600">
          Your data belongs to you. You can export it at any time in standard
          formats and delete your account and all associated data whenever you
          choose.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
