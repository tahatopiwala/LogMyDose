import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const steps = [
  {
    number: "1",
    title: "Pick your protocol",
    description:
      "Choose from templates for GLP-1s, peptides, HRT, or supplements—or create your own custom protocol.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Log your first dose",
    description:
      "Takes 10 seconds. Set reminders if you want them. That's it—you're tracking.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
  {
    number: "3",
    title: "See your patterns",
    description:
      "Your history visualized and organized. Spot trends to discuss with your healthcare provider.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Get started in 2 minutes
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple setup, powerful results. Start tracking your health protocol
            today.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" staggerDelay={0.15}>
          {steps.map((step, index) => (
            <StaggerItem key={step.number}>
              <div className="relative">
                {/* Connecting line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gray-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-200 rotate-45" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary-600">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-gray-600 max-w-xs">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Import callout */}
        <FadeIn delay={0.3} className="mt-16 text-center">
          <p className="text-gray-600">
            Already tracking elsewhere?{" "}
            <a href="/#switcher" className="text-primary-600 font-medium hover:underline">
              Import from Apple Health or upload your history
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
