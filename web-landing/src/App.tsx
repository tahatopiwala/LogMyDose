import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
    </>
  );
}

function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
          AI-generated insights are for informational purposes only.
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
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
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
