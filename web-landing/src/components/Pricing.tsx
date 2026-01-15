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
    ctaLink: "https://app.logmydose.com/signup",
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
    ctaLink: "https://app.logmydose.com/signup?plan=pro",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple pricing. Real value.
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Free to start tracking. Upgrade when you want more features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-2"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-semibold ${plan.highlighted ? "text-white" : "text-gray-900"}`}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span
                  className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                >
                  {plan.price}
                </span>
                <span
                  className={`ml-1 ${plan.highlighted ? "text-primary-100" : "text-gray-500"}`}
                >
                  {plan.period}
                </span>
              </div>
              {plan.annualPrice && (
                <div
                  className={`mt-2 text-sm ${plan.highlighted ? "text-primary-100" : "text-gray-500"}`}
                >
                  or {plan.annualPrice}{" "}
                  <span
                    className={`font-medium ${plan.highlighted ? "text-primary-200" : "text-primary-600"}`}
                  >
                    ({plan.annualSavings})
                  </span>
                </div>
              )}
              <p
                className={`mt-4 ${plan.highlighted ? "text-primary-100" : "text-gray-600"}`}
              >
                {plan.description}
              </p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.highlighted ? "text-primary-200" : "text-primary-600"}`}
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
                        plan.highlighted ? "text-white" : "text-gray-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaLink}
                className={`mt-8 block w-full py-3 px-4 rounded-xl text-center font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-white text-primary-600 hover:bg-primary-50"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          No credit card required to start. Cancel anytime. Your data is always
          exportable.
        </div>
      </div>
    </section>
  );
}
