import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SubstanceList from './pages/substances/SubstanceList'
import SubstanceForm from './pages/substances/SubstanceForm'
import ProtocolTemplateList from './pages/protocols/ProtocolTemplateList'
import ProtocolTemplateForm from './pages/protocols/ProtocolTemplateForm'
import CategoryList from './pages/categories/CategoryList'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/substances" element={<SubstanceList />} />
                  <Route path="/substances/new" element={<SubstanceForm />} />
                  <Route path="/substances/:id/edit" element={<SubstanceForm />} />
                  <Route path="/protocols" element={<ProtocolTemplateList />} />
                  <Route path="/protocols/new" element={<ProtocolTemplateForm />} />
                  <Route path="/protocols/:id/edit" element={<ProtocolTemplateForm />} />
                  <Route path="/categories" element={<CategoryList />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
