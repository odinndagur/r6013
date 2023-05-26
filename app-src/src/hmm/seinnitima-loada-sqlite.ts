import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const filePath = fileURLToPath(new URL('./someFile.txt', import.meta.url))
fs.readFile(filePath, 'utf8').then(console.log)
