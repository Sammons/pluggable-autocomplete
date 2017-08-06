import { C } from "./constants";
import { StrEnum } from "./lib/helpers";
import * as vscode from "vscode";
import { ResolverPlugin } from "./types";

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
