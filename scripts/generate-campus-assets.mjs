/**
 * Generates the /campus QR code + print-ready A5 flyer.
 *
 *   node scripts/generate-campus-assets.mjs [targetUrl]
 *
 * Outputs into campus-assets/:
 *   campus-qr.png        1400px, error correction H
 *   campus-qr.svg        vector source for print shops
 *   campus-flyer-a5.pdf  print-ready A5
 *   campus-flyer-a5.png  A5 @ 300dpi (1748x2480) for iPad display
 *
 * Always point this at the LIVE production URL, never a preview URL.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { chromium } from "@playwright/test";

const TARGET = process.argv[2] || "https://mvplabs.intelliforge.tech/campus";
const OUT_DIR = path.resolve("campus-assets");

const INK = "#14110d";
const CREAM = "#faf7f2";
const CYAN = "#06b6d4";
const AMBER = "#f59e0b";

const QR_OPTIONS = {
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: INK, light: CREAM },
};

const OFFERS = [
  { emoji: "🚀", text: "Have a product idea? Get free validation from our venture studio.", accent: CYAN },
  { emoji: "📚", text: "Want hands-on AI skills? Practitioner-led, project-first upskilling.", accent: CYAN },
  { emoji: "🎓", text: "Faculty & researchers — mentor our bootcamp cohorts.", accent: AMBER },
];

function flyerHtml(qrDataUri) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
<style>
  @page { size: A5; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 148mm; height: 210mm;
    background: ${CREAM}; color: ${INK};
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    display: flex; flex-direction: column;
    padding: 14mm 12mm 10mm;
  }
  .kicker { font-size: 8pt; letter-spacing: 0.18em; text-transform: uppercase; color: #7a7268; font-weight: 600; }
  h1 { font-family: "Space Grotesk", system-ui, sans-serif; font-size: 21pt; line-height: 1.15; margin-top: 3mm; letter-spacing: -0.01em; }
  .sub { font-size: 10pt; color: #5c554c; margin-top: 2.5mm; }
  .qr-wrap { margin: 7mm auto 6mm; padding: 4mm; background: #fff; border: 1px solid #e2dbd0; border-radius: 4mm; }
  .qr-wrap img { display: block; width: 62mm; height: 62mm; }
  .qr-url { text-align: center; font-size: 9.5pt; font-weight: 600; color: #5c554c; letter-spacing: 0.01em; }
  ul { list-style: none; margin-top: 7mm; display: flex; flex-direction: column; gap: 3.5mm; }
  li { display: flex; gap: 3mm; align-items: flex-start; font-size: 10.5pt; line-height: 1.4; border-left: 1.2mm solid; padding-left: 3mm; }
  .emoji { font-size: 12pt; line-height: 1.2; }
  footer { margin-top: auto; border-top: 1px solid #e2dbd0; padding-top: 4mm; font-size: 9pt; color: #5c554c; }
  footer strong { color: ${INK}; font-size: 10pt; }
  .contact { margin-top: 1.5mm; }
</style>
</head>
<body>
  <div class="kicker">IntelliForge × IIIT Dharwad · Campus Immersion 2026</div>
  <h1>Scan to build with IntelliForge</h1>
  <div class="sub">Building AI-native products. Pick your door.</div>

  <div class="qr-wrap"><img src="${qrDataUri}" alt="QR code to ${TARGET}" /></div>
  <div class="qr-url">mvplabs.intelliforge.tech/campus</div>

  <ul>
    ${OFFERS.map(
      (o) =>
        `<li style="border-color:${o.accent}"><span class="emoji">${o.emoji}</span><span>${o.text}</span></li>`,
    ).join("\n    ")}
  </ul>

  <footer>
    <strong>Girish Hiremath</strong> · Founder, IntelliForge Digital Services<br />
    M.Tech DS&amp;AI, IIIT Dharwad
    <div class="contact">WhatsApp +91 74166 42072 · linkedin.com/in/girish-b-hiremath</div>
  </footer>
</body>
</html>`;
}

await mkdir(OUT_DIR, { recursive: true });

const pngPath = path.join(OUT_DIR, "campus-qr.png");
const svgPath = path.join(OUT_DIR, "campus-qr.svg");

await QRCode.toFile(pngPath, TARGET, { ...QR_OPTIONS, type: "png", width: 1400 });
await writeFile(svgPath, await QRCode.toString(TARGET, { ...QR_OPTIONS, type: "svg" }));

const qrDataUri = `data:image/png;base64,${(await readFile(pngPath)).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 560, height: 794 },
  deviceScaleFactor: 3.125, // A5 @ ~300dpi
});
await page.setContent(flyerHtml(qrDataUri), { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(OUT_DIR, "campus-flyer-a5.png") });
await page.pdf({
  path: path.join(OUT_DIR, "campus-flyer-a5.pdf"),
  format: "A5",
  printBackground: true,
});
await browser.close();

console.log(`QR + flyer generated for ${TARGET} → ${OUT_DIR}`);
