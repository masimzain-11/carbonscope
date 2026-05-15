'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { IfcAPI } from 'web-ifc'

export function useIfcLoader(url: string) {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const ifcApi = new IfcAPI()
        ifcApi.SetWasmPath('/wasm/', true)
        await ifcApi.Init()

        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch IFC: ${response.statusText}`)
        const buffer = await response.arrayBuffer()
        const modelID = ifcApi.OpenModel(new Uint8Array(buffer))

        const group = new THREE.Group()

        ifcApi.StreamAllMeshes(modelID, (mesh) => {
          const placedGeometries = mesh.geometries

          for (let i = 0; i < placedGeometries.size(); i++) {
            const placed = placedGeometries.get(i)
            const geometry = ifcApi.GetGeometry(modelID, placed.geometryExpressID)
            const verts = ifcApi.GetVertexArray(
              geometry.GetVertexData(),
              geometry.GetVertexDataSize()
            ) as Float32Array
            const indices = ifcApi.GetIndexArray(
              geometry.GetIndexData(),
              geometry.GetIndexDataSize()
            ) as Uint32Array

            // Vertex layout: [x, y, z, nx, ny, nz] per vertex
            const positions = new Float32Array(verts.length / 2)
            const normals = new Float32Array(verts.length / 2)
            for (let j = 0; j < verts.length / 6; j++) {
              positions[j * 3 + 0] = verts[j * 6 + 0]
              positions[j * 3 + 1] = verts[j * 6 + 1]
              positions[j * 3 + 2] = verts[j * 6 + 2]
              normals[j * 3 + 0] = verts[j * 6 + 3]
              normals[j * 3 + 1] = verts[j * 6 + 4]
              normals[j * 3 + 2] = verts[j * 6 + 5]
            }

            const bufferGeometry = new THREE.BufferGeometry()
            bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            bufferGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
            bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1))

            const color = placed.color
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(color.x, color.y, color.z),
              transparent: color.w !== 1,
              opacity: color.w,
              side: THREE.DoubleSide,
            })

            const threeMesh = new THREE.Mesh(bufferGeometry, material)
            const matrix = new THREE.Matrix4().fromArray(placed.flatTransformation)
            threeMesh.applyMatrix4(matrix)
            group.add(threeMesh)

            geometry.delete()
          }
        })

        ifcApi.CloseModel(modelID)

        if (!cancelled) {
          setModel(group)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load IFC')
          setLoading(false)
          console.error(e)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [url])

  return { model, loading, error }
}