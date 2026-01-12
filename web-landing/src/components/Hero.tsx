export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Track Your Peptide Therapy with{' '}
            <span className="text-primary-600">AI-Powered Insights</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            DoseTrack helps you log doses, monitor progress, and get personalized insights
            from your peptide therapy journey. Smart tracking that works for you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.dosetrack.com/signup"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              Start Free Trial
            </a>
            <a
              href="#how-it-works"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Learn More
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Free for personal use.
          </p>
        </div>

        <div className="mt-20 relative">
          <div className="bg-gradient-to-b from-primary-50 to-white rounded-3xl p-4 sm:p-8 shadow-2xl shadow-gray-200/50">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-primary-50 rounded-xl p-6">
                    <div className="text-primary-600 font-semibold text-sm">This Week</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">7/7</div>
                    <div className="text-gray-600 text-sm mt-1">Doses logged</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="text-green-600 font-semibold text-sm">Streak</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">21</div>
                    <div className="text-gray-600 text-sm mt-1">Days consistent</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6">
                    <div className="text-purple-600 font-semibold text-sm">AI Insight</div>
                    <div className="text-lg font-semibold text-gray-900 mt-2">Optimal timing</div>
                    <div className="text-gray-600 text-sm mt-1">Pattern detected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
