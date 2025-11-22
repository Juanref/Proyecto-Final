type LogLevel = "START" | "INFO" | "STEP" | "WARNING" | "DEBUG" | "ERROR" | "END";

export class Logger {
  static log(level: LogLevel, message: string, extra?: unknown) {
    const timeStamp = new Date().toDateString();
    const prefix = `[${level}]`;
    const output = `${timeStamp} -> ${prefix} ${message}`;

    if(level ==="ERROR" ){
      console.log("Se imprimirá un error: ")
      console.error(output)
    }
    else
      console.log(output);
    if (extra != undefined) console.log(" ->", JSON.stringify(extra, null, 2));
  }

  static start(source: "TEST" | "SUITE" | "POM") {
    this.log("START", `====== INICIO DEL ${source} ======`);
  }

  static info(msg: string) {
    this.log("INFO", msg);
  }

  static step(msg: string) {
    this.log("STEP", msg);
  }

  static warn(msg: string) {
    this.log("WARNING", msg);
  }

  static error(msg: string, extra?: unknown) {
    this.log("ERROR", msg, extra);
  }

  static debug(msg: string, extra?: unknown) {
    this.log("DEBUG", msg, extra);
  }

  static end(msg?: string) {
    this.log("END", msg ? msg : "=== FIN DEL TEST ===");
  }
}
