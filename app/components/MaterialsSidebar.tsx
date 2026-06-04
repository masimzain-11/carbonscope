'use client'

import { MaterialAggregate } from '../hooks/useIfcLoader'
import { matchCarbonCoefficient } from '../lib/carbon-data'

interface MaterialsSidebarProps {
  materials: MaterialAggregate[]
}

export default function MaterialsSidebar({ materials }: MaterialsSidebarProps) {
  return (
    <div className="w-full h-full bg-slate-800 flex flex-col overflow-hidden">
      <div className="px-5 pt-6 pb-4 shrink-0">
        <h2 className="text-2xl font-bold text-white">Materials</h2>
        <p className="text-sm text-slate-400 mt-1">{materials.length} materials found</p>
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

      {carbonMatch && (
        <p className="text-xs text-slate-300 mt-2 pt-2 border-t border-slate-600/50">
          <span className="text-slate-500">Embodied carbon: </span>
          <span className="font-mono">{carbonMatch.kgCO2ePerUnit} kgCO₂e/{carbonMatch.unit}</span>
        </p>
      )}
    </li>
  )
})}
        </ul>
      )}
    </div>
  )
}
