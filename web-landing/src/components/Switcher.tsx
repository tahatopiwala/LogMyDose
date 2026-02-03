import { FadeIn } from "./animations/FadeIn";
import { getAppUrl } from "../lib/config";

const protocolExamples = [
  { name: "GLP-1s", examples: "Ozempic, Wegovy, Mounjaro" },
  { name: "Peptides", examples: "BPC-157, TB-500, and more" },
  { name: "HRT/TRT", examples: "Testosterone, Estrogen protocols" },
  { name: "Supplements", examples: "Vitamins, nootropics, and more" },
];

const importOptions = [
  {
    name: "Apple Health",
    description: "Sync weight, measurements, and health data automatically",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
  {
    name: "Spreadsheet",
    description: "Upload CSV or Excel files with your tracking history",
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
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    name: "Quick Setup",
    description: "Answer a few questions and start tracking in minutes",
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export function Switcher() {
  return (
    <section id="switcher" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Copy */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Track any health protocol
              </h2>
              <p className="mt-4 text-xl text-gray-300">
                One app for all your protocols. GLP-1s, peptides, HRT,
                supplements—track them all in one place.
              </p>

              {/* Protocol examples */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {protocolExamples.map((protocol) => (
                  <div
                    key={protocol.name}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <p className="text-white font-medium text-sm">{protocol.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{protocol.examples}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-green-400"
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
                Your data is always yours. Export anytime.
              </div>
            </div>

            {/* Right side - Import options */}
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-2">Already tracking elsewhere? Import your data:</p>
              {importOptions.map((option) => (
                <div
                  key={option.name}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:bg-primary-600/20 group-hover:text-primary-400 transition-colors">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{option.name}</h3>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}

              <a
                href={getAppUrl("/signup")}
                className="mt-6 block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-4 rounded-xl font-semibold transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
