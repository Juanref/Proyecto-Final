/**
 * Tipos permitidos para los niveles de log.
 */
type LogLevel = "START" | "INFO" | "STEP" | "WARNING" | "DEBUG" | "ERROR" | "END";

/**
 * Utilidad de logging centralizada para tests:
 * imprime mensajes formateados con nivel, timestamp y datos opcionales.
 */
export class Logger {
  /**
   * Imprime un mensaje con formato estándar según el nivel indicado.
   */
  static log(level: LogLevel, message: string, extra?: unknown) {
    const timeStamp = new Date().toDateString();
    const prefix = `[${level}]`;
    const output = `${timeStamp} -> ${prefix} ${message}`;

    if (level === "ERROR") {
      console.log("Se imprimirá un error: ");
      console.error(output);
    } else {
      console.log(output);
    }

    if (extra != undefined) console.log(" ->", JSON.stringify(extra, null, 2));
  }

  /**
   * Marca el inicio de un TEST, SUITE o POM.
   */
  static start(source: "TEST" | "SUITE" | "POM") {
    this.log("START", `====== INICIO DEL ${source} ======`);
  }

  /**
   * Log de información general.
   */
  static info(msg: string) {
    this.log("INFO", msg);
  }

  /**
   * Log para pasos dentro del test.
   */
  static step(msg: string) {
    this.log("STEP", msg);
  }

  /**
   * Log de advertencias.
   */
  static warn(msg: string) {
    this.log("WARNING", msg);
  }

  /**
   * Log de errores.
   */
  static error(msg: string, extra?: unknown) {
    this.log("ERROR", msg, extra);
  }

  /**
   * Log para depuración.
   */
  static debug(msg: string, extra?: unknown) {
    this.log("DEBUG", msg, extra);
  }

  /**
   * Marca el fin de un test.
   */
  static end(msg?: string) {
    this.log("END", msg ? msg : "=== FIN DEL TEST ===");
  }
}
