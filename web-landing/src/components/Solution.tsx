import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const capabilities = [
  {
    title: "See Your Patterns",
    description:
      "You logged less nausea on days you took evening doses. That's something you might want to discuss with your doctor.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    color: "emerald",
  },
  {
    title: "Organized Notes",
    description:
      "You've logged headaches 3 times this week. All in one place, ready to share at your next appointment.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    color: "amber",
  },
  {
    title: "Track Your Progress",
    description:
      "Week 4 complete. 12 doses logged. A clear record of your journey to share with your healthcare provider.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "primary",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  primary: {
    bg: "bg-primary-100",
    text: "text-primary-600",
    border: "border-primary-100",
  },
};

export function Solution() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your data, organized and ready to share
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            LogMyDose helps you track any health protocol—GLP-1s, peptides, HRT,
            supplements, and more—so you can have better conversations with your
            healthcare provider.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {capabilities.map((item) => {
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            return (
              <StaggerItem key={item.title}>
                <div
                  className={`bg-white rounded-2xl p-6 shadow-sm border ${colors.border} h-full`}
                >
                  <div
                    className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} mb-4`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{item.description}"
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* What we are callout */}
        <FadeIn delay={0.2}>
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                A tracking tool—not a medical device
              </h3>
              <p className="text-gray-300 text-lg">
                LogMyDose helps you organize your personal health notes. We don't
                diagnose, treat, or provide medical advice. Always work with your
                healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
