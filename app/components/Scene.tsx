'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'

export default function Scene() {
  return (
    <div className="w-full h-screen bg-slate-900">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Placeholder cube — this is where the IFC building will render later */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>

        <Grid
          args={[20, 20]}
          cellSize={1}
          cellColor="#475569"
          sectionSize={5}
          sectionColor="#64748b"
          fadeDistance={30}
          infiniteGrid
        />

        <OrbitControls />
      </Canvas>
    </div>
  )
}