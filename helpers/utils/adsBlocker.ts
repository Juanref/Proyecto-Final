import { Page } from "@playwright/test";

const blockedDomains = [
  "googlesyndication.com",
  "adservice.google.com",
  "doubleclick.net",
  "adroll.com",
  "adsystem.com",
];

export async function blockAds(page: Page) {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (blockedDomains.some(domain => url.includes(domain))) {
      return route.abort(); 
    }
    return route.continue();
  });
}
