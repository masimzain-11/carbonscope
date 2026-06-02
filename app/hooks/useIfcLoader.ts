'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'
import {
  IfcAPI,
  IFCWALL,
  IFCSLAB,
  IFCCOLUMN,
  IFCBEAM,
  IFCRELASSOCIATESMATERIAL,
} from 'web-ifc'

export interface MaterialAggregate {
  materialName: string
  totalElements: number
  elementsByType: Record<string, number>
}

// Walks any "material association" down to the first concrete IfcMaterial.
// Handles IfcMaterial, IfcMaterialLayerSetUsage, IfcMaterialLayerSet,
// IfcMaterialList, and IfcMaterialConstituentSet.
// Returns the expressID of the resolved material, or null.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveMaterialID(entity: any): number | null {
  if (!entity) return null

  // Direct IfcMaterial (has a string Name, no nested layer structure)
  if (entity.Name && typeof entity.Name.value === 'string' && !entity.ForLayerSet) {
    return entity.expressID
  }

  // IfcMaterialLayerSetUsage → ForLayerSet
  if (entity.ForLayerSet) return resolveMaterialID(entity.ForLayerSet)

  // IfcMaterialLayerSet → MaterialLayers[0].Material
  if (entity.MaterialLayers?.length > 0) {
    return resolveMaterialID(entity.MaterialLayers[0].Material)
  }

  // IfcMaterialList → Materials[0]
  if (entity.Materials?.length > 0) {
    return resolveMaterialID(entity.Materials[0])
  }

  // IfcMaterialConstituentSet → MaterialConstituents[0].Material
  if (entity.MaterialConstituents?.length > 0) {
    return resolveMaterialID(entity.MaterialConstituents[0].Material)
  }

  return null
}

async function extractMaterials(
  ifcApi: IfcAPI,
  modelID: number
): Promise<MaterialAggregate[]> {
  // --- PART A: Build elementID → materialID Map ---
  const elementToMaterial = new Map<number, number>()

  const relIDs = ifcApi.GetLineIDsWithType(modelID, IFCRELASSOCIATESMATERIAL)
  console.log('[DEBUG] relIDs raw:', relIDs)
  console.log('[DEBUG] relIDs is array?', Array.isArray(relIDs))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log('[DEBUG] relIDs size:', (relIDs as any).size?.() ?? (relIDs as any).length)

  let inspected = 0
  for (const relID of relIDs) {
    const rel = ifcApi.GetLine(modelID, relID, true)

    if (!rel.RelatingMaterial) continue

    const materialID = resolveMaterialID(rel.RelatingMaterial)

    if (inspected < 1) {
      console.log('[INSPECT] sample rel.RelatingMaterial:', rel.RelatingMaterial)
      console.log('[INSPECT] resolved materialID:', materialID)
      console.log('[INSPECT] first RelatedObject:', rel.RelatedObjects?.[0])
      inspected++
    }

    if (materialID === null) continue

    for (const ref of rel.RelatedObjects) {
      elementToMaterial.set(ref.expressID, materialID)
    }
  }
  console.log('[DEBUG] elementToMaterial size after Part A:', elementToMaterial.size)

  // --- PART B: For each element type we care about, group by material ---
  const ELEMENT_TYPES = [
    { id: IFCWALL, name: 'IFCWALL' },
    { id: IFCSLAB, name: 'IFCSLAB' },
    { id: IFCCOLUMN, name: 'IFCCOLUMN' },
    { id: IFCBEAM, name: 'IFCBEAM' },
  ]

  const aggregation = new Map<number, Record<string, number>>()

  for (const elemType of ELEMENT_TYPES) {
    const elemIDs = ifcApi.GetLineIDsWithType(modelID, elemType.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log(`[DEBUG] ${elemType.name} count:`, (elemIDs as any).size?.() ?? (elemIDs as any).length)
    for (const elemID of elemIDs) {
      const matID = elementToMaterial.get(elemID)
      if (matID === undefined) continue

      if (!aggregation.has(matID)) aggregation.set(matID, {})
      const byType = aggregation.get(matID)!
      byType[elemType.name] = (byType[elemType.name] || 0) + 1
    }
  }
  console.log('[DEBUG] aggregation size:', aggregation.size)

  // --- PART C: Resolve material names and produce the final list ---
  const result: MaterialAggregate[] = []

  for (const [matID, byType] of aggregation) {
    const material = ifcApi.GetLine(modelID, matID, true)
    const materialName =
      material.Name?.value || `Material #${matID} (type: ${material.type})`

    const totalElements = Object.values(byType).reduce((sum, n) => sum + n, 0)

    result.push({ materialName, totalElements, elementsByType: byType })
  }

  return result.sort((a, b) => b.totalElements - a.totalElements)
}

export function useIfcLoader(url: string) {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materials, setMaterials] = useState<MaterialAggregate[]>([])

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

        const extractedMaterials = await extractMaterials(ifcApi, modelID)
  console.log('Extracted materials:', extractedMaterials)

        ifcApi.CloseModel(modelID)

        if (!cancelled) {
          setModel(group)
          setMaterials(extractedMaterials)
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

  return { model, materials, loading, error }
}
