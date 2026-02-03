import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-raised">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">
            A better way to track
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            See how BioStak compares to what you might be using today.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8" staggerDelay={0.15}>
          {/* vs Spreadsheets/Notes */}
          <StaggerItem>
            <div className="bg-surface-card rounded-2xl p-6 md:p-8 border border-surface-border h-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">
              vs. Notes & Spreadsheets
            </h3>

            <div className="space-y-4">
              {trackingComparison.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 py-3 border-b border-surface-border last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5"
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
                      className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-sm text-gray-100 font-medium">
                      {row.us}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </StaggerItem>

          {/* vs Telehealth Programs */}
          <StaggerItem>
            <div className="bg-surface-card rounded-2xl p-6 md:p-8 border border-surface-border h-full">
              <h3 className="text-lg font-semibold text-gray-100 mb-6">
                vs. Expensive Telehealth Programs
              </h3>

              <div className="space-y-4">
                {programComparison.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 py-3 border-b border-surface-border last:border-0"
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5"
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
                        className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
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
                      <span className="text-sm text-gray-100 font-medium">
                        {row.us}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
