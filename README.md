# CarbonScope

A web tool that analyzes the embodied carbon footprint of construction projects from their BIM/IFC files. Built to support compliance with EU CSRD, UAE Estidama, India IGBC, and similar regulations that require embodied carbon reporting for new buildings. Developed using AI-augmented pair-programming, with all domain logic, architecture, and calibration decisions made by the engineer.

**Live demo:** [carbonscope-beta.vercel.app](https://carbonscope-beta.vercel.app)

## What it does

Upload a building's BIM file (IFC format). The tool:

1. Renders the 3D model in your browser (WebAssembly-powered IFC parser).
2. Extracts material data and quantities by walking the IFC graph (including layered material chains).
3. Matches each material against a 25-entry academic carbon database (ICE v3, University of Bath).
4. Calculates total embodied carbon (tCO₂e) using real volumes × density × coefficients.

## Tech stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **3D rendering:** React Three Fiber, Three.js
- **IFC parsing:** web-ifc (WebAssembly)
- **Carbon data:** Inventory of Carbon & Energy (ICE) database v3
- **Hosting:** Vercel

## Current status

Active development. MVP scope:

- [x] IFC file loading and 3D rendering
- [x] Material extraction (handles IfcMaterialLayerSetUsage chains)
- [x] Volume extraction from IfcElementQuantity
- [x] Carbon database matcher with fuzzy patterns
- [x] Embodied carbon calculation per material and total
- [x] Drag-and-drop IFC file upload (with sample fallback)
- [x] Per-m² carbon intensity with low/typical/high benchmarks
- [x] Geographic-coordinate handling (auto-centers any BIM model)
- [ ] Geometry-based sanity check for unreliable BIM quantities
- [ ] LLM fallback for unmatched material names
- [ ] PDF report export
- [ ] Direct `IfcBuilding.GrossFloorArea` extraction
- [ ] Regional carbon coefficients (UAE, India, US, EU)

## Background

The construction industry is responsible for roughly 40% of global CO₂ emissions. The "embodied carbon" of a building — the CO₂ released to manufacture materials before anyone moves in — is now subject to mandatory reporting in the EU (CSRD), UK (Part Z, pending), California, UAE, and elsewhere. Current tools cost $5,000–$20,000 per report and take weeks. CarbonScope produces a first-pass estimate in seconds, directly from the BIM file the design team already has.

## Known limitations (current beta)

CarbonScope is a working prototype. Several refinements planned for v1:

- **Volume aggregation:** Some BIM files include unreliable quantity data (incorrect `IfcQuantityVolume` values, unit-system mismatches during export). v1 will add a sanity-check layer comparing reported quantities against geometry-derived volumes.
- **Floor area:** Currently estimated from `IFCSLAB` volumes assuming 0.2m slab thickness. v1 will extract `IfcBuilding.GrossFloorArea` directly.
- **Unmatched materials:** The carbon database contains 25 common construction materials. v1 will add an LLM-based fallback to classify unrecognized material names.
- **Regional coefficients:** Currently uses global averages from the ICE v3 database. v1 will add region-specific coefficients (UAE, India, US).

These are documented openly because shipping with honest caveats is more useful than hiding them.

## Sample

The demo loads a sample structural concrete building (~5 MB IFC file). Live calculation shows roughly **1,000 tCO₂e** of embodied carbon — about the climate impact of 220 average US households' annual emissions.

## Running locally

```bash
git clone https://github.com/masimzain-11/carbonscope
cd carbonscope
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT