import { test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test("capture approved-size hero reproduction", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Single-writer desktop evidence capture");
  await page.setViewportSize({ width: 1536, height: 1024 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".hero-image").waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".home-hero img"));
    return images.length >= 1 && images.every((image) => image.complete && image.naturalWidth > 0);
  });
  const reviewDirectory = `.impeccable/review/homepage-upgrade/${process.env.VISUAL_VARIANT ?? "after"}`;
  await mkdir(reviewDirectory, { recursive: true });
  await page.screenshot({ path: `${reviewDirectory}/hero-repro-1536.png`, fullPage: false, animations: "disabled" });
});
