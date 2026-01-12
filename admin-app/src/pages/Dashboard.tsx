import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { substancesApi, protocolsApi } from '../lib/api'

export default function Dashboard() {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => substancesApi.getCategories(),
  })

  const { data: substancesData } = useQuery({
    queryKey: ['substances'],
    queryFn: () => substancesApi.getSubstances({ limit: 1 }),
  })

  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => protocolsApi.getTemplates({ limit: 1 }),
  })

  const stats = [
    {
      name: 'Categories',
      value: categoriesData?.categories.length ?? 0,
      href: '/categories',
      color: 'bg-blue-500',
    },
    {
      name: 'Substances',
      value: substancesData?.pagination.total ?? 0,
      href: '/substances',
      color: 'bg-green-500',
    },
    {
      name: 'Protocol Templates',
      value: templatesData?.pagination.total ?? 0,
      href: '/protocols',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the LogMyDose admin panel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:px-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stat.value}
            </dd>
            <div className={`absolute top-0 right-0 w-2 h-full ${stat.color}`} />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/substances/new"
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-primary-400 hover:ring-1 hover:ring-primary-400"
          >
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Add New Substance</p>
              <p className="truncate text-sm text-gray-500">Create a new substance entry</p>
            </div>
          </Link>

          <Link
            to="/protocols/new"
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-primary-400 hover:ring-1 hover:ring-primary-400"
          >
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Add Protocol Template</p>
              <p className="truncate text-sm text-gray-500">Create a new protocol template</p>
            </div>
          </Link>

          <Link
            to="/categories"
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-primary-400 hover:ring-1 hover:ring-primary-400"
          >
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Manage Categories</p>
              <p className="truncate text-sm text-gray-500">View and edit substance categories</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
