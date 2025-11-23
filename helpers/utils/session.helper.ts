import { Page } from "@playwright/test";
import { Logger } from "./log.helper";
import fs from "fs";

const DEFAULT_SESSION_PATH = "auth/suite2.session.json";
const DEFAULT_USERINFO_PATH = "data/suite2.user.json";

/**
 * Guarda el estado del navegador (cookies y storage) en un archivo JSON.
 */
export async function saveSession(page: Page, filePath = DEFAULT_SESSION_PATH): Promise<void> {
  Logger.step(`Guardando sesión en ${filePath}`);
  await page.context().storageState({ path: filePath });
}

/**
 * Guarda la información del usuario en un archivo JSON.
 */
export function saveUserInfo(
  userData: Record<string, unknown>,
  filePath = DEFAULT_USERINFO_PATH,
): void {
  Logger.step(`Guardando información del usuario en ${filePath}`);

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        ...userData,
        savedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
}

/**
 * Carga y retorna la información del usuario desde un archivo JSON.
 */
export function getSavedUser<T = Record<string, unknown>>(filePath = DEFAULT_USERINFO_PATH): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ No se encontró el archivo de usuario: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

/**
 * Guarda la sesión y la información del usuario en archivos separados.
 */
export async function saveSessionWithUser(
  page: Page,
  userData: Record<string, unknown>,
  sessionPath = DEFAULT_SESSION_PATH,
  userInfoPath = DEFAULT_USERINFO_PATH,
): Promise<void> {
  await saveSession(page, sessionPath);
  saveUserInfo(userData, userInfoPath);
}
