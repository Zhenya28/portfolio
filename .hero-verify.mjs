import { chromium } from "playwright-core";
const exec = process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const browser = await chromium.launch({ executablePath: exec, args: ["--no-sandbox", "--enable-unsafe-swiftshader"] });

// desktop
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3001/pl", { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
// chaos: drift phase starts at 2.6+3.4+1.5=7.5s; shoot at 8s
await page.waitForTimeout(8000);
await page.screenshot({ path: "/tmp/v-chaos.png" });
// next form done at 9.7+... hold of cube ~11.2-14.6; shoot at 12s
await page.waitForTimeout(4000);
await page.screenshot({ path: "/tmp/v-cube.png" });
// knot hold: 19.8-23.2; shoot 21s
await page.waitForTimeout(9000);
await page.screenshot({ path: "/tmp/v-knot.png" });
console.log("desktop errors:", errors.length ? errors : "none");

// mobile
const m = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
await m.goto("http://localhost:3001/pl", { waitUntil: "networkidle" });
await m.waitForSelector("canvas");
await m.waitForTimeout(4000); // first hold (globe)
await m.screenshot({ path: "/tmp/v-mobile.png" });
await browser.close();
