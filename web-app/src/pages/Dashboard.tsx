import { Link } from 'react-router-dom'

const recentDoses = [
  { id: 1, substance: 'BPC-157', dose: '250mcg', time: 'Today, 8:00 AM', site: 'Subcutaneous - Abdomen' },
  { id: 2, substance: 'TB-500', dose: '2.5mg', time: 'Yesterday, 8:00 AM', site: 'Subcutaneous - Abdomen' },
  { id: 3, substance: 'BPC-157', dose: '250mcg', time: 'Yesterday, 8:00 PM', site: 'Subcutaneous - Abdomen' },
]

const insights = [
  {
    id: 1,
    type: 'streak',
    title: 'Great consistency!',
    description: 'You have logged doses for 21 consecutive days.',
    color: 'green',
  },
  {
    id: 2,
    type: 'pattern',
    title: 'Optimal timing detected',
    description: 'Your data suggests morning doses work best for you.',
    color: 'blue',
  },
]

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, John</h1>
        <p className="text-gray-600 mt-1">Here's your therapy overview for today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/log"
          className="bg-primary-600 text-white rounded-xl p-6 hover:bg-primary-700 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <div className="mt-4 font-semibold">Log Dose</div>
          <div className="text-primary-100 text-sm">Record your next dose</div>
        </Link>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-primary-600 font-semibold text-sm">This Week</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">5/7</div>
          <div className="text-gray-600 text-sm mt-1">Doses logged</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-green-600 font-semibold text-sm">Streak</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">21</div>
          <div className="text-gray-600 text-sm mt-1">Days consistent</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-purple-600 font-semibold text-sm">Next Dose</div>
          <div className="text-xl font-bold text-gray-900 mt-2">BPC-157</div>
          <div className="text-gray-600 text-sm mt-1">Due at 8:00 PM</div>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-xl p-6 ${
                insight.color === 'green' ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${
                    insight.color === 'green' ? 'text-green-900' : 'text-blue-900'
                  }`}>
                    {insight.title}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    insight.color === 'green' ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {insight.description}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  insight.color === 'green' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    insight.color === 'green' ? 'text-green-600' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">AI-generated insight</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Doses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Doses</h2>
          <Link to="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
          {recentDoses.map((dose) => (
            <div key={dose.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{dose.substance}</div>
                <div className="text-sm text-gray-500">{dose.site}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{dose.dose}</div>
                <div className="text-sm text-gray-500">{dose.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
