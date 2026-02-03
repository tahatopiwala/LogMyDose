import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">
            Everything you need to stay organized
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Simple tracking tools for any health protocol—GLP-1s, peptides, HRT,
            supplements, and more.
          </p>
        </FadeIn>

        {/* Bento Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5" staggerDelay={0.08}>
          {/* Featured Card - Simple Dose Logging */}
          <StaggerItem className="md:col-span-2 lg:col-span-2">
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-400/10 rounded-3xl p-8 lg:p-10 relative overflow-hidden h-full border border-primary-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 bg-primary-500/20 backdrop-blur rounded-2xl flex items-center justify-center text-primary-400">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl lg:text-3xl font-bold text-gray-100">Simple Dose Logging</h3>
                <p className="mt-3 text-lg text-gray-300 max-w-md">
                  Log your doses in seconds with one tap. Track timing, dosage, and injection sites effortlessly.
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* See Your Patterns */}
          <StaggerItem>
            <div className="bg-emerald-900/20 rounded-3xl p-6 lg:p-8 border border-emerald-800/30 h-full">
              <div className="w-12 h-12 bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-100">See Your Patterns</h3>
              <p className="mt-2 text-gray-400">
                View your data organized by time and progress. Spot trends to discuss with your doctor.
              </p>
            </div>
          </StaggerItem>

          {/* Side Effect Notes */}
          <StaggerItem>
            <div className="bg-amber-900/20 rounded-3xl p-6 lg:p-8 border border-amber-800/30 h-full">
              <div className="w-12 h-12 bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-100">Side Effect Notes</h3>
              <p className="mt-2 text-gray-400">
                Log how you're feeling alongside your dose history. Helpful info for appointments.
              </p>
            </div>
          </StaggerItem>

          {/* Progress Tracking */}
          <StaggerItem>
            <div className="bg-surface-card rounded-3xl p-6 lg:p-8 border border-surface-border h-full">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-100">Progress Tracking</h3>
              <p className="mt-2 text-gray-400">
                See your complete history at a glance. Know exactly what to tell your provider.
              </p>
            </div>
          </StaggerItem>

          {/* Export & Share */}
          <StaggerItem>
            <div className="bg-surface-card rounded-3xl p-6 lg:p-8 border border-surface-border h-full">
              <div className="w-12 h-12 bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-100">Export & Share</h3>
              <p className="mt-2 text-gray-400">
                Generate reports to share with your doctor. Your data, formatted and ready.
              </p>
            </div>
          </StaggerItem>

          {/* Private & Secure - Compact */}
          <StaggerItem>
            <div className="bg-surface-elevated rounded-3xl p-6 lg:p-8 text-white flex items-center gap-5 h-full border border-surface-border">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Private & Secure</h3>
                <p className="text-sm text-gray-400 mt-1">Your data stays yours. We never sell your information.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
