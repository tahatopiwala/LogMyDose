const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds. No credit card required for personal use.',
  },
  {
    step: '02',
    title: 'Add Your Protocol',
    description: 'Enter your peptide protocol details or let your clinic set it up for you.',
  },
  {
    step: '03',
    title: 'Log Your Doses',
    description: 'Quick, one-tap logging with smart defaults. It takes just seconds.',
  },
  {
    step: '04',
    title: 'Get AI Insights',
    description: 'Receive personalized insights and recommendations based on your data.',
  },
]

export function HowItWorks() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
              )}
              <div className="text-5xl font-bold text-primary-100">{item.step}</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
