import pkg from 'xlsx'
const XLSX = pkg
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Path to the confidential dev file (gitignored, stays local)
const FILE_PATH = path.join(__dirname, '..', 'dev-data', 'Bill 18 Finishes Combined.xlsx')

// ---- STEP 1: Read the workbook ----
const workbook = XLSX.readFile(FILE_PATH)
console.log('Sheet names:', workbook.SheetNames)

// ---- STEP 2: Pick the data sheet ----
// The cover sheet "18 (C)" has almost no data; the real data is in "18-Finishes".
// Heuristic: pick the sheet with the most rows that have a number in column C.
function pickDataSheet(wb) {
  let best = null
  let bestScore = -1
  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })
    // Count rows that have a numeric value in column index 2 (column C)
    const score = rows.filter(r => typeof r[2] === 'number').length
    console.log(`  Sheet "${name}": ${score} rows with numeric col C`)
    if (score > bestScore) {
      bestScore = score
      best = name
    }
  }
  return best
}

const dataSheetName = pickDataSheet(workbook)
console.log('\nSelected data sheet:', dataSheetName)

// ---- STEP 3: Convert sheet to a row array ----
const sheet = workbook.Sheets[dataSheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })
console.log('Total rows:', rows.length)

// Column mapping (0-indexed) based on this file's structure:
// A=0 item code, B=1 description, C=2 quantity, D=3 unit, E=4 rate, F=5 total
const COL = { code: 0, desc: 1, qty: 2, unit: 3, rate: 4, total: 5 }

// ---- STEP 4: Walk rows, identify line items ----
// A "line item" = a row that has a numeric quantity AND a unit.
const lineItems = []

for (let i = 0; i < rows.length; i++) {
  const row = rows[i]
  if (!row) continue

  const qty = row[COL.qty]
  const unit = row[COL.unit]

  // Is this a real line item? Needs a numeric quantity and a unit.
  if (typeof qty === 'number' && unit != null && String(unit).trim() !== '') {
    // Description on this row (often a sub-description like "To Museum Building")
    const ownDesc = row[COL.desc] ? String(row[COL.desc]).trim() : ''

    // Stitch: look UPWARD for the material-type description.
    // Collect non-empty description rows above that DON'T have their own qty,
    // until we hit a blank gap or another line item.
    let parentDesc = ''
    for (let j = i - 1; j >= 0 && j >= i - 5; j--) {
      const above = rows[j]
      if (!above) continue
      const aboveQty = above[COL.qty]
      const aboveDesc = above[COL.desc] ? String(above[COL.desc]).trim() : ''

      // Stop if the row above is itself a line item (has a qty)
      if (typeof aboveQty === 'number') break
      // Capture the nearest non-empty description line above
      if (aboveDesc !== '') {
        parentDesc = aboveDesc
        break
      }
    }

    const fullDescription = [parentDesc, ownDesc].filter(Boolean).join(' — ')

    lineItems.push({
      rowNumber: i + 1,
      itemCode: row[COL.code] != null ? String(row[COL.code]).trim() : '',
      description: fullDescription,
      quantity: qty,
      unit: String(unit).trim(),
    })
  }
}

// ---- STEP 5: Report ----
console.log('\n=== PARSED LINE ITEMS ===')
console.log('Total line items found:', lineItems.length)
console.log('\nFirst 25 items:\n')
for (const item of lineItems.slice(0, 25)) {
  console.log(`[${item.itemCode}] ${item.quantity} ${item.unit}`)
  console.log(`     ${item.description}`)
}

// Units summary
const unitCounts = {}
for (const item of lineItems) {
  unitCounts[item.unit] = (unitCounts[item.unit] || 0) + 1
}
console.log('\nUnits distribution:', unitCounts)