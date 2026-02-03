import { motion } from "framer-motion";
import { getAppUrl } from "../lib/config";

export function Hero() {
  return (
    <section className="min-h-screen w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              Smart Protocol Tracking
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Take control of your{" "}
              <span className="text-primary-600">health protocol</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Track your doses, see your patterns, and stay organized. Whether
              it's GLP-1s, peptides, HRT, or supplements—your data in one place,
              ready to share with your doctor.
            </p>

            {/* What we are */}
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simple tracking
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your data, organized
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Share with your provider
              </span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={getAppUrl("/signup")}
                className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 text-center"
              >
                Get Started Free
              </a>
              <a
                href="/#how-it-works"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-gray-300 transition-colors text-center"
              >
                See How It Works
              </a>
            </div>

            {/* App Store Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="transition-opacity hover:opacity-80"
                aria-label="Download on the App Store"
              >
                <img
                  src="/ios-badge.svg"
                  alt="Download on the App Store"
                  className="h-10"
                />
              </a>
              <a
                href="#"
                className="transition-opacity hover:opacity-80"
                aria-label="Get it on Google Play"
              >
                <img
                  src="/android-badge.svg"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your data stays yours
              </span>
            </div>
          </motion.div>

          {/* Right Side - App Mockup */}
          <motion.div
            className="relative lg:h-[600px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Background decorations */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #BE3455 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-primary-200/40 to-primary-100/30 rounded-full blur-3xl -top-10 -right-10" />
            <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-emerald-200/40 to-teal-100/30 rounded-full blur-3xl bottom-10 right-20" />

            {/* Phone Mockup */}
            <div className="relative z-10 transform lg:rotate-2">
              <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-gray-400/30">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
                <div className="bg-gray-50 rounded-[2.25rem] w-72 sm:w-80 h-[620px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-white px-6 pt-8 pb-2 flex justify-between items-center text-xs text-gray-600">
                    <span className="font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2.5 rounded-sm border border-gray-400 relative">
                        <div className="absolute inset-0.5 right-1 bg-gray-400 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-white px-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Your Journal
                        </h2>
                        <p className="text-sm text-gray-500">
                          Week 4 on Semaglutide
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          JM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="px-4 py-4 space-y-3">
                    {/* Pattern Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                            Your Pattern
                          </div>
                          <p className="text-sm text-gray-900 mt-1 font-medium">
                            You logged less nausea on days with evening doses
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Based on your last 14 entries
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Note Card */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                            Your Note
                          </div>
                          <p className="text-sm text-gray-900 mt-1 font-medium">
                            You've logged fatigue 3 times this week
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Something to share at your next appointment
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                            Your Progress
                          </div>
                          <p className="text-sm text-gray-900 mt-1 font-medium">
                            Week 4 complete. 12 doses logged this month.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Great consistency!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Log Button */}
                    <button className="w-full bg-primary-600 text-white rounded-2xl py-3.5 font-semibold text-sm shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Log Today's Dose
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
