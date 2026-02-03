import { FadeIn } from "./animations/FadeIn";
import { getAppUrl } from "../lib/config";

export function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500/20 to-primary-400/10 border-y border-primary-500/30">
      <FadeIn className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">
          Ready to get organized?
        </h2>
        <p className="mt-4 text-xl text-gray-300">
          Start tracking your health protocol today. Simple, private, and free.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getAppUrl("/signup")}
            className="bg-primary-500 text-surface-base px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-400 transition-colors shadow-glow shadow-primary-500/40"
          >
            Get Started Free
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
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
      </FadeIn>
    </section>
  );
}
