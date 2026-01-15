const trackingComparison = [
  {
    them: "Scattered notes and spreadsheets",
    us: "Everything in one organized place",
  },
  {
    them: "Hard to see patterns in your data",
    us: "Your patterns highlighted for you",
  },
  {
    them: "Nothing to show your doctor",
    us: "Export reports to share at appointments",
  },
  {
    them: "Forget what you logged last week",
    us: "Complete history at your fingertips",
  },
  {
    them: "Manual reminders that don't adapt",
    us: "Smart reminders based on your schedule",
  },
];

const programComparison = [
  {
    them: "$150-300/month",
    us: "$9.99/month",
  },
  {
    them: "Only works with their prescriptions",
    us: "Works with any medication source",
  },
  {
    them: "Waiting for appointments to ask questions",
    us: "Your data ready whenever you need it",
  },
  {
    them: "Generic one-size-fits-all programs",
    us: "Organized around your personal journey",
  },
];

export function Comparison() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            A better way to track
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See how LogMyDose compares to what you might be using today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* vs Spreadsheets/Notes */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              vs. Notes & Spreadsheets
            </h3>

            <div className="space-y-4">
              {trackingComparison.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">{row.them}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 font-medium">
                      {row.us}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* vs Telehealth Programs */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              vs. Expensive Telehealth Programs
            </h3>

            <div className="space-y-4">
              {programComparison.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">{row.them}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 font-medium">
                      {row.us}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Callout */}
        <div className="mt-12 bg-primary-50 rounded-2xl p-8 text-center border border-primary-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            A simple tracking tool for your GLP-1 journey
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Not a medical device. Not a replacement for your doctor. Just a
            better way to organize and share your health notes.
          </p>
          <a
            href="https://app.logmydose.com/signup"
            className="inline-flex items-center gap-2 mt-6 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Get Started Free
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
