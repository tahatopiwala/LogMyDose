export function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to get organized?
        </h2>
        <p className="mt-4 text-xl text-primary-100">
          Start tracking your health protocol today. Simple, private, and free.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://app.logmydose.com/signup"
            className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            Get Started Free
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-100">
          <span className="flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Your data stays yours
          </span>
          <span className="flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}
