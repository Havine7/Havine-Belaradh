import assert from "node:assert/strict";
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const output = process.env.BROWSER_CHECK_OUTPUT || "test-results/editorial";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath,
  args: process.env.PLAYWRIGHT_NO_SANDBOX === "1" ? ["--no-sandbox"] : [],
});
const errors = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    assert.equal(
      await page.locator(".hero img").count(),
      0,
      "Aucune photographie dans la couverture",
    );
    assert.match(
      await page.locator(".hero-topline").innerText(),
      /Studio web indépendant — Lyon/,
    );
    assert.equal(await page.locator(".header .brand").innerText(), "havine.");
    const brand = await page.locator(".header .brand").evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        background: s.backgroundColor,
        border: s.borderTopWidth,
        shadow: s.boxShadow,
        padding: s.padding,
      };
    });
    assert.deepEqual(
      brand,
      {
        background: "rgba(0, 0, 0, 0)",
        border: "0px",
        shadow: "none",
        padding: "0px",
      },
      "Logo sans cadre ni cartouche",
    );
    assert.equal(
      await page
        .locator(".editorial-portfolio")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(170, 163, 159)",
    );
    assert.deepEqual(
      await page
        .locator(".project-stage>a")
        .evaluateAll((els) => els.map((el) => el.getAttribute("href"))),
      ["/demos/boulangerie", "/demos/coiffure", "/demos/plombier"],
    );
    for (const section of [
      "#realisations",
      ".project-boulangerie",
      ".project-coiffure",
      ".project-plombier",
      "#services",
      "#tarifs",
      "#apropos",
      ".faq",
      "#contact",
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "Débordement horizontal",
      );
    }
    assert.ok(
      await page
        .locator(".screen-capture")
        .evaluateAll((imgs) =>
          imgs.every((img) => img.complete && img.naturalWidth > 0),
        ),
      "Captures chargées",
    );
    const contrasts = await page
      .locator(
        ".project-description h3, .project-description p, .cover-intro p, .hero-topline, .price-card li, .contact label",
      )
      .evaluateAll((elements) => {
        const rgb = (text) => (text.match(/[\d.]+/g) || []).map(Number);
        const luminance = (channels) => {
          const c = channels.slice(0, 3).map((x) => {
            x /= 255;
            return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
          return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
        };
        return elements.map((el) => {
          const style = getComputedStyle(el);
          let parent = el;
          let bg;
          while (parent) {
            const c = rgb(getComputedStyle(parent).backgroundColor);
            if (c.length === 3 || c[3] === 1) {
              bg = c;
              break;
            }
            parent = parent.parentElement;
          }
          const fg = luminance(rgb(style.color)),
            background = luminance(bg || [170, 163, 159]);
          const ratio =
            (Math.max(fg, background) + 0.05) /
            (Math.min(fg, background) + 0.05);
          const large =
            parseFloat(style.fontSize) >= 24 ||
            (parseFloat(style.fontSize) >= 18.66 &&
              Number(style.fontWeight) >= 700);
          return {
            ratio,
            minimum: large ? 3 : 4.5,
            text: el.textContent.trim().slice(0, 45),
          };
        });
      });
    for (const item of contrasts)
      assert.ok(
        item.ratio >= item.minimum,
        `Contraste insuffisant : ${item.text} (${item.ratio})`,
      );
    const screenshots = await page
      .locator(".screen-capture")
      .evaluateAll((imgs) => imgs.map((img) => img.currentSrc));
    assert.ok(
      screenshots.every((src) =>
        src.endsWith(width <= 640 ? "-mobile.jpg" : "-desktop.jpg"),
      ),
      "Capture adaptée à la taille d’écran",
    );
    for (const [index, price] of [50, 100, 150].entries())
      assert.match(
        await page.locator(".price-card .price").nth(index).innerText(),
        new RegExp(`${price}\\s*€`),
      );
    await page.getByText("Choisir ce pack", { exact: true }).nth(1).click();
    assert.equal(
      await page.getByLabel("Votre projet").inputValue(),
      "Professionnel — 100 €",
    );
    assert.ok(
      await page
        .getByRole("button", { name: "Envoyer ma demande" })
        .isDisabled(),
    );
    if (width <= 640) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Ouvrir le menu" })
          .getAttribute("aria-expanded"),
        "false",
      );
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Réalisations", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Ouvrir le menu" })
          .getAttribute("aria-expanded"),
        "false",
      );
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `${output}/portfolio-${width}.png`,
      fullPage: true,
    });
    console.log(
      `Portfolio ${width}px : logo, couverture, captures, tarifs, contact et navigation vérifiés.`,
    );
    await page.close();
  }
  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reduced.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(await reduced.locator(".reveal-pending").count(), 0);
  assert.equal(
    await reduced
      .locator(".hero-copy")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.equal(
    await reduced
      .locator(".screen-capture")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
    "none",
  );
  await reduced.keyboard.press("Tab");
  assert.equal(
    await reduced.evaluate(() => document.activeElement.textContent.trim()),
    "Aller au contenu",
  );
  await reduced.close();
  console.log("Mouvement réduit et lien d’évitement clavier vérifiés.");
  for (const width of [1440, 390])
    for (const key of ["boulangerie", "coiffure", "plombier"]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      page.on("pageerror", (e) => errors.push(e.message));
      let posts = 0;
      page.on("request", (req) => {
        if (req.method() === "POST") posts++;
      });
      await page.goto(`${baseURL}/demos/${key}`, { waitUntil: "networkidle" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.locator('.demo-header a[href="#prestations"]').click();
      assert.ok(await page.locator("#prestations").isVisible());
      if (key !== "boulangerie") {
        await page.getByLabel("Votre nom").fill("Test navigateur");
        await page
          .getByLabel("E-mail", { exact: true })
          .fill("test@example.com");
        if (key === "coiffure") {
          const tomorrow = new Date(Date.now() + 86400000)
            .toISOString()
            .slice(0, 10);
          await page.getByLabel("Date souhaitée").fill(tomorrow);
        }
        await page.locator("select[name=service]").selectOption({ index: 1 });
        await page
          .getByLabel("Message", { exact: true })
          .fill("Test du formulaire fictif.");
        await page.getByRole("button", { name: "Tester la demande" }).click();
        await page
          .getByRole("status")
          .filter({ hasText: "Rien n’a été envoyé" })
          .waitFor();
      } else
        assert.equal(
          await page
            .getByRole("link", { name: "Contacter Havine" })
            .getAttribute("href"),
          "/#contact",
        );
      assert.equal(posts, 0, "Aucune donnée envoyée par les démos");
      await page.locator(".demo-banner a").click();
      assert.equal(new URL(page.url()).pathname, "/");
      console.log(
        `Démo ${key} ${width}px : navigation, formulaire fictif et retour au portfolio vérifiés.`,
      );
      await page.close();
    }
  assert.deepEqual(errors, [], "Erreurs JavaScript");
  console.log("Tous les contrôles navigateur ont réussi.");
} finally {
  await browser.close();
}
