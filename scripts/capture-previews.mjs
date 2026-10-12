import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const browser = await chromium.launch({
  executablePath,
  args: process.env.PLAYWRIGHT_NO_SANDBOX === "1" ? ["--no-sandbox"] : [],
});
mkdirSync("public/previews", { recursive: true });
const captures = [];
try {
  for (const project of ["boulangerie", "coiffure", "plombier"]) {
    for (const [screen, width, height] of [
      ["desktop", 1280, 960],
      ["mobile", 390, 960],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      await page.goto(`${baseURL}/demos/${project}`, {
        waitUntil: "networkidle",
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((img) => img.decode()));
      });
      await page.screenshot({
        path: `public/previews/${project}-${screen}.jpg`,
        type: "jpeg",
        quality: 85,
      });
      captures.push({
        route: `/demos/${project}`,
        file: `${project}-${screen}.jpg`,
        viewport: { width, height },
      });
      await page.close();
    }
  }
  writeFileSync(
    "public/previews/manifest.json",
    JSON.stringify(
      {
        capturedFromCommit: execFileSync("git", ["rev-parse", "HEAD"], {
          encoding: "utf8",
        }).trim(),
        description:
          "Captures réelles des routes de démonstration, sans retouche ni interface inventée. Actualiser après modification des démos.",
        captures,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Six captures réelles des démos enregistrées dans public/previews.",
  );
} finally {
  await browser.close();
}
