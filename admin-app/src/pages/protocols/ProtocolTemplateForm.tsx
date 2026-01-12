import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { protocolsApi, substancesApi } from '../../lib/api'

export default function ProtocolTemplateForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    substanceId: '',
    defaultDose: '',
    doseUnit: '',
    frequency: '',
    cycleOnWeeks: '',
    cycleOffWeeks: '',
    difficultyLevel: '',
    tags: [] as string[],
    tagInput: '',
    isPublic: true,
  })

  const [error, setError] = useState('')

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => substancesApi.getCategories(),
  })

  const { data: substancesData } = useQuery({
    queryKey: ['substances-all'],
    queryFn: () => substancesApi.getSubstances({ limit: 1000 }),
  })

  const { data: templateData, isLoading: loadingTemplate } = useQuery({
    queryKey: ['template', id],
    queryFn: () => protocolsApi.getTemplate(id!),
    enabled: isEdit,
  })

  useEffect(() => {
    if (templateData?.template) {
      const t = templateData.template
      setFormData({
        name: t.name,
        description: t.description || '',
        categoryId: t.categoryId || '',
        substanceId: t.substanceId || '',
        defaultDose: t.defaultDose?.toString() || '',
        doseUnit: t.doseUnit || '',
        frequency: t.frequency || '',
        cycleOnWeeks: t.cycleOnWeeks?.toString() || '',
        cycleOffWeeks: t.cycleOffWeeks?.toString() || '',
        difficultyLevel: t.difficultyLevel || '',
        tags: t.tags || [],
        tagInput: '',
        isPublic: t.isPublic,
      })
    }
  }, [templateData])

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof protocolsApi.createTemplate>[0]) =>
      protocolsApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      navigate('/protocols')
    },
    onError: (err: Error) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof protocolsApi.updateTemplate>[1] }) =>
      protocolsApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      queryClient.invalidateQueries({ queryKey: ['template', id] })
      navigate('/protocols')
    },
    onError: (err: Error) => setError(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const data = {
      name: formData.name,
      description: formData.description || undefined,
      categoryId: formData.categoryId || undefined,
      substanceId: formData.substanceId || undefined,
      defaultDose: formData.defaultDose ? parseFloat(formData.defaultDose) : undefined,
      doseUnit: formData.doseUnit || undefined,
      frequency: formData.frequency || undefined,
      cycleOnWeeks: formData.cycleOnWeeks ? parseInt(formData.cycleOnWeeks) : undefined,
      cycleOffWeeks: formData.cycleOffWeeks ? parseInt(formData.cycleOffWeeks) : undefined,
      difficultyLevel: formData.difficultyLevel || undefined,
      tags: formData.tags,
      isPublic: formData.isPublic,
    }

    if (isEdit) {
      updateMutation.mutate({ id: id!, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const addTag = () => {
    const value = formData.tagInput.trim()
    if (value && !formData.tags.includes(value)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, value],
        tagInput: '',
      })
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    })
  }

  if (isEdit && loadingTemplate) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Protocol Template' : 'Add Protocol Template'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categoriesData?.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.displayName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Substance</label>
              <select
                value={formData.substanceId}
                onChange={(e) => setFormData({ ...formData, substanceId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a substance</option>
                {substancesData?.substances.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                Public Template
              </label>
            </div>
          </div>
        </div>

        {/* Dosing */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dosing Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Dose</label>
              <input
                type="number"
                step="any"
                value={formData.defaultDose}
                onChange={(e) => setFormData({ ...formData, defaultDose: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dose Unit</label>
              <select
                value={formData.doseUnit}
                onChange={(e) => setFormData({ ...formData, doseUnit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select unit</option>
                <option value="mcg">mcg</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="iu">IU</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="2x_daily">2x Daily</option>
                <option value="weekly">Weekly</option>
                <option value="2x_weekly">2x Weekly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cycling */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Cycling</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cycle On (weeks)</label>
              <input
                type="number"
                value={formData.cycleOnWeeks}
                onChange={(e) => setFormData({ ...formData, cycleOnWeeks: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cycle Off (weeks)</label>
              <input
                type="number"
                value={formData.cycleOffWeeks}
                onChange={(e) => setFormData({ ...formData, cycleOffWeeks: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.tagInput}
              onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-primary-500 hover:text-primary-700">&times;</button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/protocols')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  )
}
