import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import { getAppUrl } from "../lib/config";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start tracking",
    features: [
      "Unlimited dose logging",
      "Basic progress charts",
      "Side effect notes",
      "Smart reminders",
      "Export to PDF",
    ],
    cta: "Start Free",
    ctaPath: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    annualPrice: "$79.99/year",
    annualSavings: "Save 33%",
    description: "Advanced tracking and organization",
    features: [
      "Everything in Free",
      "Pattern highlights",
      "Weekly summaries",
      "Detailed reports",
      "Historical analysis",
      "Priority support",
    ],
    cta: "Start 7-Day Trial",
    ctaPath: "/signup?plan=pro",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">
            Simple pricing. Real value.
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Free to start tracking. Upgrade when you want more features.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.15}>
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
              className={`rounded-2xl p-8 h-full ${
                plan.highlighted
                  ? "bg-gradient-to-br from-primary-500/20 to-primary-400/10 text-white ring-2 ring-primary-500 border border-primary-500/30"
                  : "bg-surface-card border border-surface-border"
              }`}
            >
              <h3
                className={`text-xl font-semibold ${plan.highlighted ? "text-primary-400" : "text-gray-100"}`}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span
                  className={`text-4xl font-bold ${plan.highlighted ? "text-gray-100" : "text-gray-100"}`}
                >
                  {plan.price}
                </span>
                <span
                  className={`ml-1 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                >
                  {plan.period}
                </span>
              </div>
              {plan.annualPrice && (
                <div
                  className={`mt-2 text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                >
                  or {plan.annualPrice}{" "}
                  <span
                    className={`font-medium ${plan.highlighted ? "text-primary-400" : "text-primary-500"}`}
                  >
                    ({plan.annualSavings})
                  </span>
                </div>
              )}
              <p
                className={`mt-4 ${plan.highlighted ? "text-gray-300" : "text-gray-400"}`}
              >
                {plan.description}
              </p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.highlighted ? "text-primary-400" : "text-primary-500"}`}
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
                    <span
                      className={
                        plan.highlighted ? "text-gray-200" : "text-gray-300"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={getAppUrl(plan.ctaPath)}
                className={`mt-8 block w-full py-3 px-4 rounded-xl text-center font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-primary-500 text-surface-base hover:bg-primary-400 shadow-glow-sm shadow-primary-500/40"
                    : "bg-surface-elevated text-gray-100 hover:bg-surface-hover border border-surface-border"
                }`}
              >
                {plan.cta}
              </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <p className="mt-8 text-center text-gray-400 text-sm">
            No credit card required to start. Cancel anytime. Your data is always
            exportable.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
