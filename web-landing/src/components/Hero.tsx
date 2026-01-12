import { useState, useEffect } from 'react'

const SLIDE_DURATION = 5000

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const slides = ['mobile', 'web']

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
      setProgressKey((prev) => prev + 1)
    }, SLIDE_DURATION)
    return () => clearInterval(interval)
  }, [slides.length])

  const handleSlideClick = (index: number) => {
    setActiveSlide(index)
    setProgressKey((prev) => prev + 1)
  }

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Side - Text Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Track Your Peptide Therapy with{' '}
              <span className="text-primary-600">AI-Powered Insights</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              LogMyDose helps you log doses, monitor progress, and get personalized insights
              from your peptide therapy journey. Smart tracking that works for you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="https://app.logmydose.com/signup"
                className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 text-center"
              >
                Start Free Trial
              </a>
              <a
                href="#how-it-works"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-gray-300 transition-colors text-center"
              >
                Learn More
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Free for personal use.
            </p>
          </div>

          {/* Right Side - Visual Carousel */}
          <div className="relative lg:h-[650px] flex items-center justify-center pb-12">
            {/* Dot Pattern */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Gradient Blobs */}
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-primary-300/60 to-primary-100/40 rounded-full blur-3xl -top-10 -right-10" />
            <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-purple-300/50 to-pink-200/40 rounded-full blur-3xl top-1/3 -right-20" />
            <div className="absolute w-[250px] h-[250px] bg-gradient-to-bl from-emerald-200/50 to-teal-100/40 rounded-full blur-3xl bottom-10 right-20" />
            <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-amber-200/40 to-orange-100/30 rounded-full blur-3xl top-20 right-1/3" />

            {/* Carousel Container */}
            <div className="relative z-10 w-full h-[520px]">
              {/* Slide 1: Fanned Phone Mockups */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                  activeSlide === 0
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-full pointer-events-none'
                }`}
              >
                <div className="relative">
                  {/* Back Phone - Log Dose Screen */}
                  <div className="absolute -left-24 sm:-left-20 lg:-left-32 top-8 transform lg:-rotate-12 -rotate-6 z-0">
                    <div className="relative bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-gray-400/20">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-10" />
                      <div className="bg-gray-50 rounded-[2rem] w-56 sm:w-60 h-[440px] overflow-hidden">
                        {/* Status Bar */}
                        <div className="bg-white px-5 pt-7 pb-2 flex justify-between items-center text-xs text-gray-600">
                          <span className="font-medium">9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <div className="w-4 h-2 rounded-sm bg-gray-300" />
                          </div>
                        </div>

                        {/* Log Dose Header */}
                        <div className="bg-white px-4 pb-3 border-b border-gray-100">
                          <h2 className="text-base font-bold text-gray-900">Log Dose</h2>
                          <p className="text-xs text-gray-500">BPC-157 - Morning</p>
                        </div>

                        {/* Dose Form */}
                        <div className="px-4 py-3 space-y-3">
                          <div className="bg-white rounded-xl p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Dosage</div>
                            <div className="text-lg font-bold text-gray-900">250 mcg</div>
                          </div>

                          <div className="bg-white rounded-xl p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Injection Site</div>
                            <div className="text-sm font-medium text-gray-900">Subcutaneous - Abdomen</div>
                          </div>

                          <div className="bg-white rounded-xl p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Time</div>
                            <div className="text-sm font-medium text-gray-900">9:30 AM</div>
                          </div>

                          <div className="bg-white rounded-xl p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Notes (optional)</div>
                            <div className="text-sm text-gray-400">Add any notes...</div>
                          </div>

                          <button className="w-full bg-primary-600 text-white rounded-xl py-3 font-semibold text-sm mt-2">
                            Confirm Dose
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Front Phone - Dashboard */}
                  <div className="relative transform lg:rotate-6 z-10">
                    <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-gray-400/30">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
                      <div className="bg-gray-50 rounded-[2.25rem] w-64 sm:w-72 h-[520px] overflow-hidden">
                        {/* Status Bar */}
                        <div className="bg-white px-6 pt-8 pb-2 flex justify-between items-center text-xs text-gray-600">
                          <span className="font-medium">9:41</span>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
                            </svg>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
                            </svg>
                          </div>
                        </div>

                        {/* App Header */}
                        <div className="bg-white px-5 pb-4">
                          <h2 className="text-lg font-bold text-gray-900">Good morning!</h2>
                          <p className="text-sm text-gray-500">Your therapy is on track</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="px-4 space-y-3">
                          {/* Today's Progress */}
                          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today</div>
                                <div className="text-2xl font-bold text-gray-900 mt-1">2 of 3</div>
                                <div className="text-sm text-gray-600">doses logged</div>
                              </div>
                              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Streak */}
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-medium text-green-100 uppercase tracking-wide">Streak</div>
                                <div className="text-2xl font-bold mt-1">21 days</div>
                              </div>
                              <div className="text-3xl">🔥</div>
                            </div>
                          </div>

                          {/* Quick Log Button */}
                          <button className="w-full bg-primary-600 text-white rounded-2xl py-3.5 font-semibold text-base shadow-lg shadow-primary-600/25">
                            + Log Dose
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2: Web Dashboard */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                  activeSlide === 1
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-full pointer-events-none'
                }`}
              >
                {/* Browser Window Mockup */}
                <div className="relative w-full max-w-lg transform lg:rotate-2">
                  <div className="bg-gray-800 rounded-xl shadow-2xl shadow-gray-400/30 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="bg-gray-700 px-4 py-3 flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 bg-gray-600 rounded-md px-3 py-1.5 text-xs text-gray-300 font-mono">
                        app.logmydose.com/dashboard
                      </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="bg-gray-50 p-4 h-[420px]">
                      {/* Dashboard Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
                          <p className="text-xs text-gray-500">Welcome back, Sarah</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-600">S</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="text-xs text-gray-500">This Week</div>
                          <div className="text-xl font-bold text-gray-900">18/21</div>
                          <div className="text-xs text-green-600">86% adherence</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="text-xs text-gray-500">Current Streak</div>
                          <div className="text-xl font-bold text-gray-900">21</div>
                          <div className="text-xs text-gray-500">days</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="text-xs text-gray-500">Active Protocols</div>
                          <div className="text-xl font-bold text-gray-900">3</div>
                          <div className="text-xs text-gray-500">peptides</div>
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-900">Weekly Progress</span>
                          <span className="text-xs text-gray-500">Last 7 days</span>
                        </div>
                        {/* Simple Bar Chart */}
                        <div className="flex items-end gap-2 h-20">
                          <div className="flex-1 bg-primary-200 rounded-t" style={{ height: '60%' }} />
                          <div className="flex-1 bg-primary-300 rounded-t" style={{ height: '80%' }} />
                          <div className="flex-1 bg-primary-400 rounded-t" style={{ height: '100%' }} />
                          <div className="flex-1 bg-primary-500 rounded-t" style={{ height: '90%' }} />
                          <div className="flex-1 bg-primary-400 rounded-t" style={{ height: '70%' }} />
                          <div className="flex-1 bg-primary-500 rounded-t" style={{ height: '100%' }} />
                          <div className="flex-1 bg-primary-300 rounded-t" style={{ height: '50%' }} />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>

                      {/* AI Insight Card */}
                      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-3 border border-primary-100">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-900">AI Insight</div>
                            <p className="text-xs text-gray-600 mt-0.5">Your morning doses show 95% consistency. Consider setting a reminder for evening doses.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Progress Indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-6 z-20">
              {slides.map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideClick(index)}
                  className="flex flex-col items-center gap-2"
                  aria-label={`Go to ${label} slide`}
                >
                  <div className="relative h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      key={activeSlide === index ? progressKey : `static-${index}`}
                      className={`absolute inset-y-0 left-0 rounded-full bg-primary-600 ${
                        index < activeSlide ? 'w-full' : index > activeSlide ? 'w-0' : ''
                      }`}
                      style={
                        activeSlide === index
                          ? {
                              animation: `progress ${SLIDE_DURATION}ms linear forwards`,
                            }
                          : undefined
                      }
                    />
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      activeSlide === index ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  >
                    {label === 'mobile' ? 'Mobile' : 'Web'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
