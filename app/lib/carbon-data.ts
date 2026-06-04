// Embodied carbon coefficients for common construction materials.
// Source: ICE Database v3 (Inventory of Carbon & Energy, Univ. of Bath, 2019)
//         Plus selected additions from Ökobaudat (German government EPDs).
// Values are kg CO2 equivalent per UNIT (kg, m3, or m2).
//
// IMPORTANT: These are rough average global values. Real-world embodied
// carbon varies by region, manufacturing process, supplier, recycled content,
// and transport distance. For production use these should be replaced with
// EPD-specific values per project.

export interface CarbonCoefficient {
  /** Lowercase keywords used to match against IFC material names. */
  patterns: string[]
  /** Human-readable category for grouping in the UI. */
  category: 'concrete' | 'steel' | 'masonry' | 'wood' | 'insulation' | 'glass' | 'aluminum' | 'other'
  /** Embodied carbon coefficient. */
  kgCO2ePerUnit: number
  /** What "unit" this coefficient is measured per. */
  unit: 'kg' | 'm3' | 'm2'
  /** Approximate density for converting between mass and volume (kg/m3). */
  densityKgPerM3: number
  /** Where the number came from — important for credibility. */
  source: string
  /** Human-friendly note shown in UI / reports. */
  notes?: string
}

// ----- The database -----
// Roughly ordered by how common the material is in real construction.
// Patterns are matched case-insensitive, against the material name from IFC.

export const CARBON_DATABASE: CarbonCoefficient[] = [
  // ===== CONCRETE =====
  {
    patterns: ['concrete', 'cast-in-place', 'cast in place', 'opc', 'portland cement', 'rcc'],
    category: 'concrete',
    kgCO2ePerUnit: 0.103,
    unit: 'kg',
    densityKgPerM3: 2400,
    source: 'ICE v3',
    notes: 'Generic OPC concrete, ~30 MPa, average cement content',
  },
  {
    patterns: ['concrete 20 mpa', 'concrete 25 mpa', 'low strength concrete'],
    category: 'concrete',
    kgCO2ePerUnit: 0.093,
    unit: 'kg',
    densityKgPerM3: 2400,
    source: 'ICE v3',
    notes: 'Low-strength structural concrete',
  },
  {
    patterns: ['concrete 28 mpa', 'concrete 30 mpa', 'concrete 32 mpa', 'normal strength concrete'],
    category: 'concrete',
    kgCO2ePerUnit: 0.107,
    unit: 'kg',
    densityKgPerM3: 2400,
    source: 'ICE v3',
    notes: 'Standard structural concrete used in most slabs and columns',
  },
  {
    patterns: ['concrete 35 mpa', 'concrete 40 mpa', 'concrete 50 mpa', 'high strength concrete'],
    category: 'concrete',
    kgCO2ePerUnit: 0.132,
    unit: 'kg',
    densityKgPerM3: 2450,
    source: 'ICE v3',
    notes: 'Higher cement content = higher embodied carbon',
  },
  {
    patterns: ['ggbs', 'slag', 'blended cement', 'low carbon concrete'],
    category: 'concrete',
    kgCO2ePerUnit: 0.052,
    unit: 'kg',
    densityKgPerM3: 2400,
    source: 'ICE v3',
    notes: 'Concrete with steel-industry byproduct replacing 50% cement; ~50% CO2 reduction',
  },
  {
    patterns: ['precast concrete', 'precast'],
    category: 'concrete',
    kgCO2ePerUnit: 0.222,
    unit: 'kg',
    densityKgPerM3: 2400,
    source: 'ICE v3',
    notes: 'Factory-cast concrete elements; higher CO2 from formwork + handling',
  },

  // ===== STEEL =====
  {
    patterns: ['steel', 'rebar', 'reinforcement', 'reinforcing steel', 'reinforcement bar'],
    category: 'steel',
    kgCO2ePerUnit: 1.99,
    unit: 'kg',
    densityKgPerM3: 7850,
    source: 'ICE v3',
    notes: 'Average world steel mix, ~60% recycled content',
  },
  {
    patterns: ['structural steel', 'steel section', 'i-beam', 'h-beam', 'steel s355', 'steel s345', '345 mpa', 'metal - steel'],
    category: 'steel',
    kgCO2ePerUnit: 1.55,
    unit: 'kg',
    densityKgPerM3: 7850,
    source: 'ICE v3',
    notes: 'Structural section steel; often higher recycled content than rebar',
  },
  {
    patterns: ['stainless steel'],
    category: 'steel',
    kgCO2ePerUnit: 6.15,
    unit: 'kg',
    densityKgPerM3: 7900,
    source: 'ICE v3',
    notes: 'Much higher CO2 than carbon steel due to alloying elements',
  },

  // ===== MASONRY =====
  {
    patterns: ['brick', 'fired clay', 'red brick'],
    category: 'masonry',
    kgCO2ePerUnit: 0.24,
    unit: 'kg',
    densityKgPerM3: 1700,
    source: 'ICE v3',
    notes: 'Fired clay brick; CO2 from kiln firing',
  },
  {
    patterns: ['block', 'cmu', 'concrete block', 'masonry block'],
    category: 'masonry',
    kgCO2ePerUnit: 0.073,
    unit: 'kg',
    densityKgPerM3: 1900,
    source: 'ICE v3',
    notes: 'Concrete masonry units (hollow blocks)',
  },
  {
    patterns: ['aac', 'aerated concrete', 'autoclaved'],
    category: 'masonry',
    kgCO2ePerUnit: 0.34,
    unit: 'kg',
    densityKgPerM3: 600,
    source: 'ICE v3',
    notes: 'Lightweight autoclaved aerated concrete; lower density',
  },

  // ===== WOOD =====
  {
    patterns: ['timber', 'wood', 'softwood', 'lumber', 'sawn timber'],
    category: 'wood',
    kgCO2ePerUnit: 0.31,
    unit: 'kg',
    densityKgPerM3: 500,
    source: 'ICE v3',
    notes: 'Excludes biogenic carbon storage; reporting basis matters here',
  },
  {
    patterns: ['glulam', 'glued laminated', 'clt', 'cross-laminated', 'mass timber'],
    category: 'wood',
    kgCO2ePerUnit: 0.51,
    unit: 'kg',
    densityKgPerM3: 500,
    source: 'ICE v3',
    notes: 'Engineered timber; processing + adhesives add CO2 vs sawn',
  },
  {
    patterns: ['plywood'],
    category: 'wood',
    kgCO2ePerUnit: 0.68,
    unit: 'kg',
    densityKgPerM3: 540,
    source: 'ICE v3',
  },

  // ===== INSULATION =====
  {
    patterns: ['rigid insulation', 'eps', 'expanded polystyrene', 'polystyrene'],
    category: 'insulation',
    kgCO2ePerUnit: 3.43,
    unit: 'kg',
    densityKgPerM3: 30,
    source: 'ICE v3',
    notes: 'EPS rigid foam insulation',
  },
  {
    patterns: ['xps', 'extruded polystyrene'],
    category: 'insulation',
    kgCO2ePerUnit: 9.51,
    unit: 'kg',
    densityKgPerM3: 35,
    source: 'ICE v3',
    notes: 'XPS has very high CO2 due to blowing agents',
  },
  {
    patterns: ['mineral wool', 'rock wool', 'stone wool'],
    category: 'insulation',
    kgCO2ePerUnit: 1.28,
    unit: 'kg',
    densityKgPerM3: 100,
    source: 'ICE v3',
  },
  {
    patterns: ['glass wool', 'fibre glass insulation', 'fiberglass insulation'],
    category: 'insulation',
    kgCO2ePerUnit: 1.35,
    unit: 'kg',
    densityKgPerM3: 20,
    source: 'ICE v3',
  },

  // ===== GLASS =====
  {
    patterns: ['glass', 'glazing', 'window glass'],
    category: 'glass',
    kgCO2ePerUnit: 1.44,
    unit: 'kg',
    densityKgPerM3: 2500,
    source: 'ICE v3',
    notes: 'Float glass; double-glazed units add ~20%',
  },

  // ===== ALUMINUM =====
  {
    patterns: ['aluminum', 'aluminium'],
    category: 'aluminum',
    kgCO2ePerUnit: 13.1,
    unit: 'kg',
    densityKgPerM3: 2700,
    source: 'ICE v3',
    notes: 'Average; recycled aluminum has ~10x lower CO2',
  },

  // ===== OTHER COMMON FINISHES =====
  {
    patterns: ['gypsum', 'plasterboard', 'drywall', 'gypsum board'],
    category: 'other',
    kgCO2ePerUnit: 0.39,
    unit: 'kg',
    densityKgPerM3: 800,
    source: 'ICE v3',
  },
  {
    patterns: ['plaster', 'render', 'mortar'],
    category: 'other',
    kgCO2ePerUnit: 0.18,
    unit: 'kg',
    densityKgPerM3: 1300,
    source: 'ICE v3',
  },
  {
    patterns: ['ceramic tile', 'ceramic', 'porcelain tile'],
    category: 'other',
    kgCO2ePerUnit: 0.78,
    unit: 'kg',
    densityKgPerM3: 2000,
    source: 'ICE v3',
  },
  {
    patterns: ['asphalt', 'bitumen'],
    category: 'other',
    kgCO2ePerUnit: 0.43,
    unit: 'kg',
    densityKgPerM3: 2300,
    source: 'ICE v3',
  },
  {
    patterns: ['copper'],
    category: 'other',
    kgCO2ePerUnit: 3.83,
    unit: 'kg',
    densityKgPerM3: 8960,
    source: 'ICE v3',
  },
]

// ----- Matcher -----
// Given a messy material name from an IFC file (e.g.,
// "Concrete - Cast-in-Place Concrete - 28 MPa"), find the best matching
// CarbonCoefficient. Returns null if no pattern matched.

export function matchCarbonCoefficient(materialName: string): CarbonCoefficient | null {
  if (!materialName) return null

  // Normalize: lowercase, replace dashes/underscores with spaces, collapse multiple spaces.
  // This lets "Concrete - 35 MPa" match patterns like "concrete 35 mpa".
  const normalized = materialName
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Find all entries whose ANY pattern is a substring of the material name
  const matches: { entry: CarbonCoefficient; score: number }[] = []

  for (const entry of CARBON_DATABASE) {
    for (const pattern of entry.patterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        // Score = length of pattern (longer pattern = more specific match)
        matches.push({ entry, score: pattern.length })
        break // only score each entry once
      }
    }
  }

  if (matches.length === 0) return null

  // Return the entry with the longest (most specific) matched pattern
  matches.sort((a, b) => b.score - a.score)
  return matches[0].entry
}
// ----- Element mass estimation -----
// Rough average mass (kg) per element type, used as a placeholder
// until we extract actual volumes from IFC. Numbers are conservative
// averages for medium-scale construction; real values can vary 5-10x.

export const AVG_ELEMENT_MASS_KG: Record<string, number> = {
  IFCWALL: 4500,    // ~3m x 3m x 0.2m wall of concrete ≈ 4300 kg
  IFCSLAB: 12000,   // ~20m² x 0.2m slab of concrete ≈ 12000 kg
  IFCCOLUMN: 1800,  // ~3m x 0.3m x 0.3m column of concrete ≈ 650 kg, ×3 for reinforcement
  IFCBEAM: 600,     // ~5m beam, varies enormously
}

/**
 * Rough estimate of total mass (kg) for a material aggregate,
 * using element counts × average mass per type.
 * Replace with actual volume extraction in v1.
 */
export function estimateMassKg(elementsByType: Record<string, number>): number {
  let total = 0
  for (const [type, count] of Object.entries(elementsByType)) {
    const avgMass = AVG_ELEMENT_MASS_KG[type] ?? 1000  // fallback for unknown types
    total += count * avgMass
  }
  return total
}

/**
 * Estimate total embodied carbon (kg CO2e) for a material aggregate.
 * Returns null if the material has no matched coefficient.
 */
export function estimateEmbodiedCarbonKg(
  materialName: string,
  elementsByType: Record<string, number>,
  totalVolumeM3: number = 0
): number | null {
  const match = matchCarbonCoefficient(materialName)
  if (!match) return null

  // Prefer real volume if we have it (volume × density × coefficient).
  // Fall back to placeholder element-count estimate when volume is 0.
  if (totalVolumeM3 > 0) {
    const massKg = totalVolumeM3 * match.densityKgPerM3
    return massKg * match.kgCO2ePerUnit
  }

  // Fallback: rough placeholder using element counts
  const massKg = estimateMassKg(elementsByType)
  return massKg * match.kgCO2ePerUnit
}