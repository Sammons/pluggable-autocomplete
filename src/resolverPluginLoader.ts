import { C } from "./constants";
import { StrEnum } from "./lib/helpers";
import * as vscode from "vscode";
import { ResolverPlugin, ResolutionElement } from "./types";
import * as fs from "fs";
import * as util from "util";

const _errors = StrEnum(
  "NoWorkSpace",
  "NoPlugins",
  "PluginLoadError",
  "InvalidPlugin",
  "UnknownError"
);

type ErrorString = keyof typeof _errors;
export type ErrorResult = {
  code: ErrorString;
  error?: Error;
};

export class ResolverPluginLoader {
  constructor() {}
  errors = _errors;
  async wrapJsonFile(context: vscode.ExtensionContext, jsonFilePath: string) {
    if (!fs.existsSync(jsonFilePath)) {
      vscode.window.showErrorMessage(
        `${jsonFilePath} does not exist, pluggable autocomplete cannot access it.`
      );
      return;
    }
    const contents: Buffer = await new Promise<Buffer>((resolve, reject) => {
      return fs.readFile(jsonFilePath, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
    try {
      const resolution = JSON.parse(contents.toString("utf8"));
      if (!Array.isArray(resolution.items)) {
        vscode.window.showErrorMessage(`Missing key .items in json definition: ${jsonFilePath}`);
        return;
      }
      if (resolution.name == null) {
        vscode.window.showErrorMessage(`Missing key .name in json definition: ${jsonFilePath}`)
        return;
      }
      class AnonJsonResolver implements ResolverPlugin {
        constructor() {}
        name = resolution.name;
        resolveItems = () => resolution.items;
      }
      return new AnonJsonResolver() as ResolverPlugin
    } catch (e) {
      vscode.window.showErrorMessage(
        `Failed to parse pluggable autocomplete file: ${e.message}`
      );
    }
  }
  async loadPlugins(
    context: vscode.ExtensionContext
  ): Promise<((ErrorResult | ResolverPlugin)[]) | ErrorResult> {
    try {
      const rootPath = vscode.workspace.rootPath;
      if (rootPath == null) {
        return { code: this.errors.NoWorkSpace };
      }
      const plugins = await vscode.workspace.findFiles(`.${C.project}/**/*.js`);
      return plugins.map(plugin => {
        try {
          const loaded = require(plugin.fsPath) as ResolverPlugin;
          if (
            !loaded.resolveItems ||
            typeof loaded.resolveItems !== "function"
          ) {
            return {
              code: this.errors.InvalidPlugin,
              error: new Error(
                `Plugin at path ${plugin.fsPath} missing .resolveItems`
              )
            } as ErrorResult;
          }
          return loaded;
        } catch (error) {
          return { code: this.errors.PluginLoadError, error } as ErrorResult;
        }
      });
    } catch (error) {
      return { code: this.errors.UnknownError, error };
    }
  }
}
