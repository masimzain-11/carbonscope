'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import { useIfcLoader } from '../hooks/useIfcLoader'
import MaterialsSidebar from './MaterialsSidebar'

function IfcBuilding({ model, loading }: { model: THREE.Group | null; loading: boolean }) {
  if (loading || !model) return null
  return <primitive object={model} />
}

export default function Scene() {
  const { model, materials, loading, error } = useIfcLoader('/sample.ifc')

  return (
    <div className="flex w-full h-screen bg-slate-900">
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
