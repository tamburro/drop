import fs from "fs"
import path from "path"
import { tokens } from "./tokens"
import { tokenKeyToCssVar, sidebarKeyToCssVar } from "./utils"

const GLOBALS_PATH = path.join(process.cwd(), "app/globals.css")
const START_MARKER = "/* TOKENS:START */"
const END_MARKER = "/* TOKENS:END */"

function generateRootBlock(): string {
  const lines: string[] = []

  for (const [key, value] of Object.entries(tokens.colors)) {
    lines.push(`  ${tokenKeyToCssVar(key)}: ${value};`)
  }

  for (const [key, value] of Object.entries(tokens.sidebar)) {
    lines.push(`  ${sidebarKeyToCssVar(key)}: ${value};`)
  }

  lines.push(`  --radius: ${tokens.radius.md};`)

  return `${START_MARKER}\n:root {\n${lines.join("\n")}\n}\n${END_MARKER}`
}

function run() {
  const current = fs.readFileSync(GLOBALS_PATH, "utf8")
  const generated = generateRootBlock()

  const hasMarkers = current.includes(START_MARKER) && current.includes(END_MARKER)

  let updated: string
  if (hasMarkers) {
    updated = current.replace(
      new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
      generated
    )
  } else {
    updated = current + "\n" + generated + "\n"
  }

  const isCheck = process.argv.includes("--check")

  if (isCheck) {
    if (current !== updated) {
      console.error("❌ globals.css está desatualizado. Rode: npm run tokens")
      process.exit(1)
    }
    console.log("✅ globals.css está sincronizado com tokens.ts")
    return
  }

  fs.writeFileSync(GLOBALS_PATH, updated)
  console.log("✅ globals.css atualizado com tokens de design-system/tokens.ts")
}

run()
