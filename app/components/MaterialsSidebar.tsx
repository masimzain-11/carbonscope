'use client'

import { MaterialAggregate } from '../hooks/useIfcLoader'
import { matchCarbonCoefficient, estimateEmbodiedCarbonKg } from '../lib/carbon-data'

function formatTons(kg: number): string {
  const tons = kg / 1000
  if (tons >= 100) return tons.toFixed(0)
  if (tons >= 10) return tons.toFixed(1)
  return tons.toFixed(2)
}
interface MaterialsSidebarProps {
  materials: MaterialAggregate[]
}

export default function MaterialsSidebar({ materials }: MaterialsSidebarProps) {
  return (
    <div className="w-full h-full bg-slate-800 flex flex-col overflow-hidden">
      <div className="px-5 pt-6 pb-4 shrink-0 border-b border-slate-700">
  <h2 className="text-2xl font-bold text-white">Materials</h2>
  <p className="text-sm text-slate-400 mt-1">{materials.length} materials found</p>

  {materials.length > 0 && (
    <div className="mt-4 p-3 bg-slate-900/60 rounded-lg">
      <p className="text-xs text-slate-400 uppercase tracking-wide">
        Estimated Total Embodied Carbon
      </p>
      <p className="text-2xl font-bold text-emerald-300 mt-1">
        {formatTons(
  materials.reduce((sum, mat) => {
    const c = estimateEmbodiedCarbonKg(mat.materialName, mat.elementsByType, mat.totalVolumeM3)
    return sum + (c ?? 0)
  }, 0)
)}
        <span className="text-sm text-slate-400 ml-1.5">tCO₂e</span>
      </p>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">
      Calculated from real IFC volumes · ICE v3 coefficients
    </p>
    </div>
  )}
</div>

      {materials.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">No materials extracted yet</p>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
          {materials.map((mat) => {
          const breakdown = Object.entries(mat.elementsByType)
          .map(([type, count]) => `${type}: ${count}`)
          .join(' · ')

  const carbonMatch = matchCarbonCoefficient(mat.materialName)
  const estimatedKgCO2 = estimateEmbodiedCarbonKg(mat.materialName, mat.elementsByType, mat.totalVolumeM3)

  return (
    <li
      key={mat.materialName}
      className="bg-slate-700 rounded-xl px-4 py-3"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-white text-sm flex-1">
          {mat.materialName}
        </p>
        {carbonMatch ? (
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
            {carbonMatch.category}
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 shrink-0">
            unmatched
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1">{mat.totalElements} elements</p>

      {breakdown && (
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{breakdown}</p>
      )}

      {carbonMatch && estimatedKgCO2 !== null && (
  <div className="mt-2 pt-2 border-t border-slate-600/50">
    <p className="text-xs text-slate-500">
      Coefficient: <span className="font-mono text-slate-400">{carbonMatch.kgCO2ePerUnit} kgCO₂e/{carbonMatch.unit}</span>
    </p>
    <p className="text-sm text-emerald-300 font-semibold mt-1">
      ≈ {formatTons(estimatedKgCO2)} tCO₂e
      <span className="text-[10px] text-slate-500 font-normal ml-1.5 uppercase tracking-wide">estimated</span>
    </p>
  </div>
)}
    </li>
  )
})}
        </ul>
      )}
    </div>
  )
}
