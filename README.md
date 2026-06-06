# CarbonScope

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-blue.svg)](https://carbonscope-beta.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![Status: Beta](https://img.shields.io/badge/status-beta-orange.svg)](#current-status)

**Embodied carbon analysis for construction projects — from the Bill of Quantities every estimator already produces.**

CarbonScope estimates the embodied carbon footprint of a building and turns that number into a decision: which materials drive the impact, what alternatives exist, and what each swap costs in money and carbon. It is built around the **Bill of Quantities (BoQ)** — the Excel/CSV file every QS firm produces — rather than the BIM/IFC models that are usually locked inside client systems and unavailable to the people actually pricing the job.

Built for compliance with EU CSRD, UAE Estidama, India IGBC, Saudi Mostadam, California SB-253, and similar regulations that now require embodied-carbon reporting for new construction.

**Live demo:** [carbonscope-beta.vercel.app](https://carbonscope-beta.vercel.app)

> **Where this is today:** The working build demonstrates the full calculation engine on **IFC input** — 3D parse → material extraction → carbon calculation. **BoQ (Excel/CSV) ingestion is the active next milestone**, because in real construction workflows the BIM is locked but the BoQ is shareable. See [Roadmap](#roadmap).

---

## Screenshots

> _Screenshots will be added to `docs/` shortly. In the meantime, click the live demo to see the product in action._

| Drop zone (landing) | Analysis view (3D model + carbon breakdown) |
|---|---|
| Upload an IFC file or use the sample | Total tCO₂e, per-m² intensity, material breakdown |

---

## What it does

Give CarbonScope a project's material quantities. The tool:

1. **Ingests quantities** — today from an IFC file (walks the IFC graph, including layered material chains and `IfcElementQuantity` volumes); next, directly from a BoQ in Excel/CSV.
2. **Matches each material** against a carbon-coefficient database (currently 25 entries, ICE v3 from the University of Bath) using fuzzy name matching with input normalization.
3. **Calculates embodied carbon** (tCO₂e) as real volume × density × coefficient, per material and as a project total.
4. **Benchmarks intensity** — reports carbon per m² against low / typical / high industry bands so the number is interpretable.
5. **Highlights hotspots** — flags the materials contributing the most to the total carbon footprint, where the biggest wins are available.
---

## How carbon is calculated (methodology)

CarbonScope computes **cradle-to-gate embodied carbon (life-cycle stages A1–A3)** — the emissions from raw-material extraction, transport, and manufacture, before the material reaches site.

For each material:
Coefficients come from the **Inventory of Carbon & Energy (ICE) v3** (University of Bath) — a peer-reviewed academic dataset. Every figure is traceable to its source, and the roadmap adds per-line confidence scoring so users can see how reliable each match is.

**Scope boundary:** CarbonScope covers product-stage embodied carbon (A1–A3). It does **not** currently model construction-stage (A4–A5), use-stage operational carbon (B), or end-of-life (C). This keeps the tool fast and decision-focused rather than a full life-cycle assessment.

---

## ⚠️ Status and intended use

CarbonScope produces a **first-pass estimate for early decision-making, design comparison, and procurement guidance.** It is **not** a verified Life-Cycle Assessment and is **not** a substitute for an accredited assessment or an official certification submission (e.g. LEED, BREEAM, Estidama Pearl, CSRD filings).

Use it to:
- Find embodied-carbon hotspots in your project
- Compare material alternatives during estimating
- Inform sustainability conversations with clients early
- Generate first-pass figures for tender responses

Then verify high-stakes figures through an accredited process before regulatory submission.

This boundary is documented openly because a tool you can trust the limits of is more useful than one that hides them.

---

## Tech stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **3D rendering:** React Three Fiber, Three.js
- **IFC parsing:** web-ifc (WebAssembly)
- **BoQ parsing (next):** SheetJS / PapaParse (Excel/CSV)
- **Carbon data:** Inventory of Carbon & Energy (ICE) v3
- **Hosting:** Vercel

---

## Current status

Active development.

**Working today**
- [x] IFC file loading and in-browser 3D rendering
- [x] Material extraction (handles `IfcMaterialLayerSetUsage` and layered material chains)
- [x] Volume extraction from `IfcElementQuantity`
- [x] Carbon-database matcher with fuzzy patterns and input normalization
- [x] Embodied-carbon calculation per material and total
- [x] Drag-and-drop IFC upload with sample fallback
- [x] Per-m² carbon intensity with low / typical / high benchmarks
- [x] Auto-centering for BIM files with geographic coordinates
- [x] Honest beta labeling and known-limitation disclosure

**Active next milestone — BoQ-first**
- [ ] BoQ upload (Excel/CSV) with auto column detection and manual mapping fallback
- [ ] Unit normalization layer (m³, M3, cum, cu.m, m^3 → one canonical unit)
- [ ] End-to-end pipeline on real BoQ files from active projects

**Planned (v1)**
- [ ] Per-line confidence scoring and data-source provenance for every match
- [ ] LLM fallback (Claude API) for material names the static matcher can't recognize
- [ ] Material-replacement suggestions ranked by cost + carbon tradeoff
- [ ] Whole-project optimization (slider: maximum carbon reduction at +X% budget)
- [ ] PDF report export, client-ready
- [ ] Regional carbon coefficients (UAE, India, US, EU)
- [ ] Carbon-as-money framing (CBAM exposure, Estidama tier economics, tender mode)
- [ ] Geometry-based sanity check for unreliable BIM quantities
- [ ] Direct `IfcBuilding.GrossFloorArea` extraction

---

## Roadmap

| Phase | Focus | State |
|---|---|---|
| Phase 0 | IFC engine: parse, extract, match, calculate | ✅ Complete |
| Phase 1 | BoQ parser (Excel/CSV) + index data capture | 🔜 Active |
| Phase 2 | Database expansion, confidence scoring, replacement engine v1 | Planned |
| Phase 3 | Whole-project optimization, PDF reports, accounts | Planned |
| Phase 4 | Compliance reports, carbon-as-money, billing | Planned |
| Phase 5 | API, integrations, multi-user workspaces | Planned |
| Year 2 | As-built carbon variance, regional index productization | Future |

---

## Background

The construction industry is responsible for roughly 40% of global CO₂ emissions. The "embodied carbon" of a building — the CO₂ released to manufacture its materials before anyone moves in — is now subject to mandatory or imminent reporting in the EU (CSRD), UAE (Estidama, Al Sa'fat), Saudi Arabia (Mostadam), India (IGBC, GRIHA), the UK (Part Z, pending), and California (SB-253).

Existing assessments cost $5,000–$20,000 per report and take weeks. They are built for sustainability consultants working from BIM models. The people who actually price materials — quantity surveyors and cost engineers — work from the BoQ. CarbonScope meets them there, producing a first-pass estimate in seconds from data they already have, and helping them suggest material alternatives that cut both carbon and cost.

---

## Known limitations (current beta)

CarbonScope is a working prototype. The following refinements are planned for v1:

- **Volume aggregation:** Some BIM files include unreliable quantity data (incorrect `IfcQuantityVolume` values, unit-system mismatches on export). v1 adds a sanity-check layer comparing reported quantities against geometry-derived volumes.
- **Floor area:** Currently estimated from `IFCSLAB` volumes assuming a 0.2 m slab thickness. v1 extracts `IfcBuilding.GrossFloorArea` directly.
- **Unmatched materials:** The database holds 25 common materials. v1 adds an LLM-based fallback to classify unrecognized names.
- **Regional coefficients:** Currently global ICE v3 averages. v1 adds region-specific coefficients (UAE, India, US, EU).
- **Scope:** A1–A3 only (see methodology). Other life-cycle stages are out of current scope by design.

---

## Sample

The demo loads a sample multi-storey structural-concrete building (~5 MB IFC). Live calculation shows roughly **1,000 tCO₂e** of embodied carbon — comparable to the annual carbon footprint of approximately 220 average US households' energy use (using EPA Greenhouse Gas Equivalencies as the reference).

You can also drop in your own IFC file. Nothing is uploaded — files are parsed entirely in your browser via WebAssembly.

---

## Running locally

```bash
git clone https://github.com/masimzain-11/carbonscope
cd carbonscope
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The sample IFC file in `public/sample.ifc` (5 MB) will load by default. To use your own file, drag it onto the upload zone.

---

## Contact / pilots

CarbonScope is actively seeking pilot customers among quantity-surveying firms, cost-engineering teams, and contractors working in the GCC and India. If you produce Bills of Quantities and need embodied-carbon analysis without a BIM-only workflow, get in touch.

- **Maintainer:** [@masimzain-11](https://github.com/masimzain-11)
- **Pilot enquiries:** Open an [issue](https://github.com/masimzain-11/carbonscope/issues) or connect on [LinkedIn](https://www.linkedin.com/in/masimzain-11/)

---

## License

**GNU Affero General Public License v3.0 (AGPL-3.0)** — see [LICENSE](./LICENSE).

CarbonScope is source-available under the AGPL. You are free to use, study, modify, and self-host it. The key condition: if you run a modified version as a network service, you must make your modified source available to its users under the same license. This keeps the project genuinely open while preventing it from being forked into a closed, competing commercial service.

For commercial licensing that is not subject to the AGPL's copyleft terms, contact [LinkedIn](https://www.linkedin.com/in/masimzain-11/) or open a GitHub issue.

> Note: the regional cost/carbon datasets, calibration data, and any customer data are **not** part of this repository and are not covered by this license.

Copyright (C) 2025-2026 Asim Zain.