/**
 * Bloquea dominios de publicidad para acelerar la carga y evitar popups.
 * Aplica un route global que aborta solicitudes hacia dominios conocidos de ads.
 */
import { Page } from "@playwright/test";

const blockedDomains = [
  "googlesyndication.com",
  "adservice.google.com",
  "doubleclick.net",
  "adroll.com",
  "adsystem.com",
];

/**
 * Configura reglas de bloqueo de anuncios para la página.
 */
export async function blockAds(page: Page) {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (blockedDomains.some(domain => url.includes(domain))) {
      return route.abort();
    }
    return route.continue();
  });
}
