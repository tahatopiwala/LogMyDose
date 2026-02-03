import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const painPoints = [
  {
    question: "Am I tracking this right?",
    description:
      "You're logging doses in notes, spreadsheets, or scattered apps. It's hard to see the big picture.",
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
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    question: "What should I tell my doctor?",
    description:
      "You want to share useful information at appointments, but your notes are all over the place.",
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
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    question: "I forget what I logged last week.",
    description:
      "Without a clear history, it's hard to remember patterns or share accurate information with your healthcare provider.",
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export function Problem() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Sound familiar?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Tracking your health protocol shouldn't be complicated. But right
            now, it probably is.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point) => (
            <StaggerItem key={point.question}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 mb-6">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  "{point.question}"
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3} className="mt-12 text-center">
          <p className="text-xl text-gray-700 font-medium">
            You need a simple way to{" "}
            <span className="text-primary-600">track, organize, and share</span>{" "}
            your data.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
