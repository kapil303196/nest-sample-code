import * as path from "path";
import { Injectable, LoggerService, Scope } from "@nestjs/common";
import { winston } from "./winston";
import { EcgError } from "../errors/ecg-error";

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  public static DEFAULT_SCOPE = "app";

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath
        .replace(process.cwd(), "")
        .replace(`src${path.sep}`, "")
        .replace(`dist${path.sep}`, "")
        .replace(".ts", "")
        .replace(".js", "")
        .replace(path.sep, "");
    }

    return filepath;
  }

  private scope: string;

  constructor() {
    this.setScope();
  }

  public setScope(scope?: string): void {
    this.scope = WinstonLogger.parsePathToScope(
      scope ? scope : WinstonLogger.DEFAULT_SCOPE,
    );
  }

  public log(message: string, context: string): void {
    this.write("info", `[${context}] : ${message}`);
  }

  public debug(message: string, ...args: any[]): void {
    this.write("debug", message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.write("info", message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.write("warn", message, args);
  }

  public error(message: string, trace?: string, context?: string): void {
    this.write("error", `[${context}] : ${message} \n ${trace ?? ""}`);
  }

  private write(level: string, message: string, args?: any[]): void {
    if (winston) {
      winston[level](`${this.formatScope()} ${message}`, args);
    }
  }

  public logAndReturnError(error: EcgError) {
    const message = JSON.stringify(error);
    this.write("error", `[${error.code}] : ${message} \n ${error.category}`);
    return error;
  }

  private formatScope(): string {
    return `[${this.scope}]`;
  }
}
