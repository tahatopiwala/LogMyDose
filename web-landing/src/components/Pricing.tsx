const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal tracking',
    features: [
      'Unlimited dose logging',
      'Basic progress charts',
      'Side effect tracking',
      'Smart reminders',
      'Mobile app access',
    ],
    cta: 'Get Started Free',
    ctaLink: 'https://app.logmydose.com/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Advanced insights and features',
    features: [
      'Everything in Free',
      'AI-powered insights',
      'Weekly AI reports',
      'Bloodwork integration',
      'Export to PDF',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaLink: 'https://app.logmydose.com/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Clinic',
    price: 'Custom',
    period: '',
    description: 'For healthcare providers',
    features: [
      'Everything in Pro',
      'Multi-patient dashboard',
      'Protocol templates',
      'HIPAA compliance',
      'White-label options',
      'API access',
    ],
    cta: 'Contact Sales',
    ctaLink: 'mailto:sales@logmydose.com',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Free for personal use. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-2'
                  : 'bg-white'
              }`}
            >
              <h3 className={`text-xl font-semibold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className={`ml-1 ${plan.highlighted ? 'text-primary-100' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-2 ${plan.highlighted ? 'text-primary-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${plan.highlighted ? 'text-primary-200' : 'text-primary-600'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.highlighted ? 'text-white' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaLink}
                className={`mt-8 block w-full py-3 px-4 rounded-lg text-center font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-primary-600 hover:bg-primary-50'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
