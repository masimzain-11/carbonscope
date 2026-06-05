'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { useIfcLoader } from '../hooks/useIfcLoader'
import MaterialsSidebar from './MaterialsSidebar'
import UploadZone from './UploadZone'

function IfcBuilding({ model, loading }: { model: THREE.Group | null; loading: boolean }) {
  if (loading || !model) return null
  return <primitive object={model} />
}

export default function Scene() {
  // Source can be: null (show upload UI), string (demo URL), or File (user upload)
  const [source, setSource] = useState<string | File | null>(null)
  const { model, materials, loading, error } = useIfcLoader(source)

  // If no source picked yet, show the upload landing page
  if (!source) {
    return (
      <UploadZone
        onFileSelect={(file) => setSource(file)}
        onTrySample={() => setSource('/sample.ifc')}
      />
    )
  }

  // Derive a friendly label for the currently-loaded source
  const filename = typeof source === 'string' ? 'Sample Building' : source.name

  return (
    <div className="flex w-full h-screen bg-slate-900 relative">
      {/* Top control bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <button
          onClick={() => setSource(null)}
          className="px-3 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg backdrop-blur-sm transition-colors border border-slate-700"
        >
          ← Upload different file
        </button>
        <div className="px-3 py-1.5 text-xs bg-slate-800/60 text-slate-400 rounded-lg backdrop-blur-sm border border-slate-700/50">
  <span className="text-slate-500">File:</span> {filename}
</div>
<div className="px-3 py-1.5 text-xs bg-amber-500/10 text-amber-400 rounded-lg backdrop-blur-sm border border-amber-500/30">
  Beta · numbers approximate on some files
</div>
</div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold">Parsing IFC file...</p>
            <p className="text-slate-400 text-sm mt-1">Extracting materials and volumes</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20 backdrop-blur-sm">
          <div className="text-center max-w-md p-6">
            <p className="text-rose-400 font-semibold text-lg mb-2">Failed to load IFC</p>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <button
              onClick={() => setSource(null)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
            >
              Try another file
            </button>
          </div>
        </div>
      )}

      {/* 3D viewer — left 70% */}
      <div className="w-[70%] h-full">
        <Canvas camera={{ position: [30, 30, 30], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[50, 50, 50]} intensity={1} />

          <Suspense fallback={null}>
            <IfcBuilding model={model} loading={loading} />
          </Suspense>

          <Grid
            args={[100, 100]}
            cellSize={1}
            cellColor="#475569"
            sectionSize={10}
            sectionColor="#64748b"
            fadeDistance={200}
            infiniteGrid
          />

          <OrbitControls makeDefault />
        </Canvas>
      </div>

      {/* Sidebar — right 30% */}
      <div className="w-[30%] h-full">
        <MaterialsSidebar materials={materials} />
      </div>
    </div>
  )
}