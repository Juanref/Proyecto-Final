import { Page } from "@playwright/test";
import { Logger } from "./log.helper";
import fs from "fs";

const DEFAULT_SESSION_PATH = "auth/suite2.session.json";
const DEFAULT_USERINFO_PATH = "data/suite2.user.json";

/**
 * Guarda el estado actual (cookies, localStorage, sessionStorage)
 * en un archivo JSON
 */
export async function saveSession(page: Page, filePath = DEFAULT_SESSION_PATH): Promise<void> {
  Logger.step(`Guardando sesión en ${filePath}`);
  await page.context().storageState({ path: filePath });
}

/**
 * Guarda los datos del usuario logueado en un archivo JSON
 * Ejemplo: { email, nombre, rol, fechaCreacion }
 *
 * @param userData - Objeto con la info del usuario
 * @param filePath - Ruta de almacenamiento
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
 * Carga la información del usuario desde un archivo JSON
 * Ejemplo: retorna { email, name, password, savedAt }
 *
 * @param filePath - Ruta del archivo que contiene los datos del usuario
 */
export function getSavedUser<T = Record<string, unknown>>(filePath = DEFAULT_USERINFO_PATH): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ No se encontró el archivo de usuario: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

/**
 * Guarda sesión + usuario juntos
 * Esta función es útil para ser llamada al terminar un login exitoso
 *
 * @param page - Page de Playwright
 * @param userData - Información del usuario (email, id, rol, etc.)
 * @param sessionPath - archivo donde guardar la sesión
 * @param userInfoPath - archivo donde guardar el usuario
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
