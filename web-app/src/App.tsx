import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { LogDose } from './pages/LogDose'

function History() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dose History</h1>
      <p className="text-gray-600 mt-1">View all your logged doses.</p>
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        History view coming soon...
      </div>
    </div>
  )
}

function Insights() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
      <p className="text-gray-600 mt-1">Personalized insights from your therapy data.</p>
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        AI insights coming soon...
      </div>
    </div>
  )
}

function Protocol() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Protocol</h1>
      <p className="text-gray-600 mt-1">View and manage your therapy protocol.</p>
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        Protocol management coming soon...
      </div>
    </div>
  )
}

function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600 mt-1">Manage your account and preferences.</p>
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        Settings coming soon...
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* App routes (with layout) */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/log"
        element={
          <Layout>
            <LogDose />
          </Layout>
        }
      />
      <Route
        path="/history"
        element={
          <Layout>
            <History />
          </Layout>
        }
      />
      <Route
        path="/insights"
        element={
          <Layout>
            <Insights />
          </Layout>
        }
      />
      <Route
        path="/protocol"
        element={
          <Layout>
            <Protocol />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
