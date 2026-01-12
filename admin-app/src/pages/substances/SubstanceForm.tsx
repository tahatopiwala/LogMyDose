import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { substancesApi, Substance } from '../../lib/api'

export default function SubstanceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    aliases: [] as string[],
    aliasInput: '',
    subcategory: '',
    defaultDose: '',
    doseUnit: '',
    defaultFrequency: '',
    administrationRoute: '',
    preparationInstructions: '',
    storageTemp: '',
    storageNotes: '',
    shelfLifeDays: '',
    shelfLifeReconstitutedDays: '',
    requiresCycling: false,
    commonCycleOnWeeks: '',
    commonCycleOffWeeks: '',
    contraindications: [] as string[],
    contraindicationInput: '',
    commonSideEffects: [] as string[],
    sideEffectInput: '',
    interactions: [] as string[],
    interactionInput: '',
    onsetTimeline: '',
    isPrescriptionRequired: false,
  })

  const [error, setError] = useState('')

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => substancesApi.getCategories(),
  })

  const { data: substanceData, isLoading: loadingSubstance } = useQuery({
    queryKey: ['substance', id],
    queryFn: () => substancesApi.getSubstance(id!),
    enabled: isEdit,
  })

  useEffect(() => {
    if (substanceData?.substance) {
      const s = substanceData.substance
      setFormData({
        categoryId: s.categoryId,
        name: s.name,
        aliases: s.aliases || [],
        aliasInput: '',
        subcategory: s.subcategory || '',
        defaultDose: s.defaultDose?.toString() || '',
        doseUnit: s.doseUnit || '',
        defaultFrequency: s.defaultFrequency || '',
        administrationRoute: s.administrationRoute || '',
        preparationInstructions: s.preparationInstructions || '',
        storageTemp: s.storageTemp || '',
        storageNotes: s.storageNotes || '',
        shelfLifeDays: s.shelfLifeDays?.toString() || '',
        shelfLifeReconstitutedDays: s.shelfLifeReconstitutedDays?.toString() || '',
        requiresCycling: s.requiresCycling,
        commonCycleOnWeeks: s.commonCycleOnWeeks?.toString() || '',
        commonCycleOffWeeks: s.commonCycleOffWeeks?.toString() || '',
        contraindications: s.contraindications || [],
        contraindicationInput: '',
        commonSideEffects: s.commonSideEffects || [],
        sideEffectInput: '',
        interactions: s.interactions || [],
        interactionInput: '',
        onsetTimeline: s.onsetTimeline || '',
        isPrescriptionRequired: s.isPrescriptionRequired,
      })
    }
  }, [substanceData])

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof substancesApi.createSubstance>[0]) =>
      substancesApi.createSubstance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['substances'] })
      navigate('/substances')
    },
    onError: (err: Error) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof substancesApi.updateSubstance>[1] }) =>
      substancesApi.updateSubstance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['substances'] })
      queryClient.invalidateQueries({ queryKey: ['substance', id] })
      navigate('/substances')
    },
    onError: (err: Error) => setError(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const data = {
      categoryId: formData.categoryId,
      name: formData.name,
      aliases: formData.aliases,
      subcategory: formData.subcategory || undefined,
      defaultDose: formData.defaultDose ? parseFloat(formData.defaultDose) : undefined,
      doseUnit: formData.doseUnit || undefined,
      defaultFrequency: formData.defaultFrequency || undefined,
      administrationRoute: formData.administrationRoute || undefined,
      preparationInstructions: formData.preparationInstructions || undefined,
      storageTemp: formData.storageTemp || undefined,
      storageNotes: formData.storageNotes || undefined,
      shelfLifeDays: formData.shelfLifeDays ? parseInt(formData.shelfLifeDays) : undefined,
      shelfLifeReconstitutedDays: formData.shelfLifeReconstitutedDays ? parseInt(formData.shelfLifeReconstitutedDays) : undefined,
      requiresCycling: formData.requiresCycling,
      commonCycleOnWeeks: formData.commonCycleOnWeeks ? parseInt(formData.commonCycleOnWeeks) : undefined,
      commonCycleOffWeeks: formData.commonCycleOffWeeks ? parseInt(formData.commonCycleOffWeeks) : undefined,
      contraindications: formData.contraindications,
      commonSideEffects: formData.commonSideEffects,
      interactions: formData.interactions,
      onsetTimeline: formData.onsetTimeline || undefined,
      isPrescriptionRequired: formData.isPrescriptionRequired,
    }

    if (isEdit) {
      updateMutation.mutate({ id: id!, data })
    } else {
      createMutation.mutate(data as Omit<Substance, 'id' | 'isActive' | 'createdAt' | 'category'>)
    }
  }

  const addToArray = (field: 'aliases' | 'contraindications' | 'commonSideEffects' | 'interactions', inputField: 'aliasInput' | 'contraindicationInput' | 'sideEffectInput' | 'interactionInput') => {
    const value = formData[inputField].trim()
    if (value && !formData[field].includes(value)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value],
        [inputField]: '',
      })
    }
  }

  const removeFromArray = (field: 'aliases' | 'contraindications' | 'commonSideEffects' | 'interactions', value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter(v => v !== value),
    })
  }

  if (isEdit && loadingSubstance) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Substance' : 'Add New Substance'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                required
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
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aliases</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={formData.aliasInput}
                  onChange={(e) => setFormData({ ...formData, aliasInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('aliases', 'aliasInput'))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Press Enter to add"
                />
                <button
                  type="button"
                  onClick={() => addToArray('aliases', 'aliasInput')}
                  className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.aliases.map((alias) => (
                  <span key={alias} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {alias}
                    <button type="button" onClick={() => removeFromArray('aliases', alias)} className="ml-1 text-gray-500 hover:text-gray-700">&times;</button>
                  </span>
                ))}
              </div>
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
                <option value="capsule">capsule</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Frequency</label>
              <select
                value={formData.defaultFrequency}
                onChange={(e) => setFormData({ ...formData, defaultFrequency: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="2x_daily">2x Daily</option>
                <option value="3x_daily">3x Daily</option>
                <option value="weekly">Weekly</option>
                <option value="2x_weekly">2x Weekly</option>
                <option value="3x_weekly">3x Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Administration Route</label>
              <select
                value={formData.administrationRoute}
                onChange={(e) => setFormData({ ...formData, administrationRoute: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select route</option>
                <option value="oral">Oral</option>
                <option value="injection_subq">Subcutaneous Injection</option>
                <option value="injection_im">Intramuscular Injection</option>
                <option value="topical">Topical</option>
                <option value="sublingual">Sublingual</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Preparation Instructions</label>
            <textarea
              rows={3}
              value={formData.preparationInstructions}
              onChange={(e) => setFormData({ ...formData, preparationInstructions: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Storage */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Storage Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Storage Temperature</label>
              <input
                type="text"
                value={formData.storageTemp}
                onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., 2-8°C (refrigerated)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shelf Life (days)</label>
              <input
                type="number"
                value={formData.shelfLifeDays}
                onChange={(e) => setFormData({ ...formData, shelfLifeDays: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shelf Life Reconstituted (days)</label>
              <input
                type="number"
                value={formData.shelfLifeReconstitutedDays}
                onChange={(e) => setFormData({ ...formData, shelfLifeReconstitutedDays: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Storage Notes</label>
            <textarea
              rows={2}
              value={formData.storageNotes}
              onChange={(e) => setFormData({ ...formData, storageNotes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Cycling */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Cycling Information</h2>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="requiresCycling"
              checked={formData.requiresCycling}
              onChange={(e) => setFormData({ ...formData, requiresCycling: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="requiresCycling" className="ml-2 block text-sm text-gray-900">
              Requires Cycling
            </label>
          </div>
          {formData.requiresCycling && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cycle On (weeks)</label>
                <input
                  type="number"
                  value={formData.commonCycleOnWeeks}
                  onChange={(e) => setFormData({ ...formData, commonCycleOnWeeks: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cycle Off (weeks)</label>
                <input
                  type="number"
                  value={formData.commonCycleOffWeeks}
                  onChange={(e) => setFormData({ ...formData, commonCycleOffWeeks: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Safety Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Safety Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraindications</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={formData.contraindicationInput}
                  onChange={(e) => setFormData({ ...formData, contraindicationInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('contraindications', 'contraindicationInput'))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <button type="button" onClick={() => addToArray('contraindications', 'contraindicationInput')} className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Add</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.contraindications.map((item) => (
                  <span key={item} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {item}
                    <button type="button" onClick={() => removeFromArray('contraindications', item)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Common Side Effects</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={formData.sideEffectInput}
                  onChange={(e) => setFormData({ ...formData, sideEffectInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('commonSideEffects', 'sideEffectInput'))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <button type="button" onClick={() => addToArray('commonSideEffects', 'sideEffectInput')} className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Add</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.commonSideEffects.map((item) => (
                  <span key={item} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {item}
                    <button type="button" onClick={() => removeFromArray('commonSideEffects', item)} className="ml-1 text-yellow-500 hover:text-yellow-700">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Interactions</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={formData.interactionInput}
                  onChange={(e) => setFormData({ ...formData, interactionInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('interactions', 'interactionInput'))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <button type="button" onClick={() => addToArray('interactions', 'interactionInput')} className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Add</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.interactions.map((item) => (
                  <span key={item} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {item}
                    <button type="button" onClick={() => removeFromArray('interactions', item)} className="ml-1 text-orange-500 hover:text-orange-700">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Other */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Onset Timeline</label>
              <input
                type="text"
                value={formData.onsetTimeline}
                onChange={(e) => setFormData({ ...formData, onsetTimeline: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., 2-4 weeks for noticeable effects"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrescriptionRequired"
                checked={formData.isPrescriptionRequired}
                onChange={(e) => setFormData({ ...formData, isPrescriptionRequired: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrescriptionRequired" className="ml-2 block text-sm text-gray-900">
                Prescription Required
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/substances')}
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
