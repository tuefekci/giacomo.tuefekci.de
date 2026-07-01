import puppeteer from "puppeteer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.OUTPUT_DIR || "private-build";
const outPath = join(__dirname, "..", outDir);
const htmlPath = join(outPath, "index.html");

if (!existsSync(htmlPath)) {
  console.error(`Build output not found at ${htmlPath}. Run 'npm run build:private' first.`);
  process.exit(1);
}

const browser = await puppeteer.launch({
  headless: true,
  args: ["--allow-file-access-from-files", "--disable-web-security"],
});

const page = await browser.newPage();

page.on("console", (msg) => {
  if (msg.type() === "error") console.error("[browser]", msg.text());
});

await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 30000 });

await page.pdf({
  path: join(outPath, "resume.pdf"),
  format: "A4",
  margin: { top: "15mm", bottom: "15mm", left: "18mm", right: "18mm" },
  printBackground: false,
  preferCSSPageSize: true,
  timeout: 30000,
});

await browser.close();
console.log(`PDF generated: ${join(outPath, "resume.pdf")}`);
