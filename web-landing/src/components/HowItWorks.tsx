import { useEffect, useState } from "react";

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds. No credit card required for personal use.",
  },
  {
    step: "02",
    title: "Add Your Protocol",
    description:
      "Enter your peptide protocol details or let your clinic set it up for you.",
  },
  {
    step: "03",
    title: "Log Your Doses",
    description:
      "Quick, one-tap logging with smart defaults. It takes just seconds.",
  },
  {
    step: "04",
    title: "Get AI Insights",
    description:
      "Receive personalized insights and recommendations based on your data.",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Get started in minutes
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple setup, powerful results. Start tracking your therapy today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center text-center lg:px-4"
            >
              {/* Connecting bar */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-primary-500 transition-all duration-700 ease-out ${
                      activeStep > index ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* Step number */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                  activeStep >= index
                    ? "bg-primary-500 text-white scale-110"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {item.step}
              </div>

              {/* Content */}
              <h3
                className={`mt-4 text-xl font-semibold transition-colors duration-500 ${
                  activeStep >= index ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-2 transition-colors duration-500 ${
                  activeStep >= index ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
