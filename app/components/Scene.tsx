'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import { useIfcLoader } from '../hooks/useIfcLoader'

function IfcBuilding({ url }: { url: string }) {
  const { model, loading, error } = useIfcLoader(url)

  if (error) return null
  if (!model || loading) return null

  return <primitive object={model} />
}

export default function Scene() {
  return (
    <div className="w-full h-screen bg-slate-900">
      <Canvas camera={{ position: [30, 30, 30], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 50, 50]} intensity={1} />

        <Suspense fallback={null}>
          <IfcBuilding url="/sample.ifc" />
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
  )
}