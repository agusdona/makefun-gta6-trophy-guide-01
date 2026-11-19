// Vice Trophy Guide — the entry program (Node 22, standard library only).
//
// It hands the guide in: copy this repository's app/ and screenshots/
// folders into the output directory (the grader's /output, or
// MAKEFUN_OUTPUT_DIR when run outside the grader) and write
// dossier.json there with buildDossier from the vendored make.fun library.
//
// The library must stay untouched: vendor/makefun-frontend.ts is the kit's
// copy, and the scorer rebuilds the dossier from its own copy and compares
// the two byte for byte. The caps below are the scorer's own: at most
// 160 KiB of dossier text, at most 4 screenshots of at most 256 KiB each,
// app/ at most 993 files and directories and 48 MiB in all.
//
// Run it locally like this:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The output directory is the only place this program writes. Inside the
// grader it is /output; locally it is wherever MAKEFUN_OUTPUT_DIR points.
mkdirSync(outputDir, { recursive: true });

// app/ holds the whole guide: the page, its styles, its scripts and the
// trophy data. Copy it in full, nothing left out and nothing added.
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

// screenshots/ holds the four real browser renders of the guide. The first
// by name is the cover the judge sees largest.
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier is the judge's view of the entry: the screenshots, the first
// load's files and bytes, and the source text. It is written last, from
// exactly what was just copied, so it always matches the handed-in files.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
