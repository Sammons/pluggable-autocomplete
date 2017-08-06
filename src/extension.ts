"use strict";
import "source-map-support/register";
import { ResolverPlugin } from "./types";
import { ErrorResult, ResolverPluginLoader } from "./resolverPluginLoader";
import { Resolver } from "./resolver";
import { AtPath } from "./lib/helpers";
import { C } from "./constants";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CompletionItemProvider, DocumentSelector } from "vscode";
import * as _ from "lodash";
import * as fs from "fs";
import * as path from "path";

// const loadPlugins = (plugins: vscode.Uri[]) => {
//   return plugins
//     .map(p => {
//       try {
//         let loaded = require(p.fsPath) as {
//           name: string;
//           execute: (
//             cb?: (error: string, results: string[]) => void
//           ) => string[] | Promise<string[]> | null;
//         };
//         return {
//           plugin: loaded,
//           path: p.fsPath,
//           name: AtPath(loaded, "name") || p.path
//         };
//       } catch (e) {
//         vscode.window.showWarningMessage(
//           `pluggable-autocomplete failed to load ${p.fsPath} ${e.message}`
//         );
//         return null;
//       }
//     })
//     .filter(p => p != null);
// };

// const invokePlugin = async (selectedPlugin): Promise<string[]> => {
//   return new Promise<string[]>(async (resolve, reject) => {
//     let called = false;
//     let cb = (err, res) => {
//       if (called) {
//         return;
//       }
//       called = true;
//       if (err) {
//         reject(err);
//       } else if (res) {
//         resolve(res);
//       }
//     };
//     try {
//       let result = await selectedPlugin.plugin.execute(cb);
//       if (result) {
//         cb(null, result);
//       }
//     } catch (e) {
//       cb(e, null);
//     }
//   });
// };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log("activate");

  context.subscriptions.push(
    vscode.commands.registerCommand("pluggable-autocomplete.initialize", () => {
      let root = vscode.workspace.rootPath;
      if (!root) {
        return vscode.window.showInformationMessage(
          `Please try this after opening a folder`
        );
      }
      let fldrPath = path.join(root, `./.${C.project}`);
      if (fs.existsSync(fldrPath)) {
        let stat = fs.statSync(fldrPath);
        if (!stat.isDirectory()) {
          return vscode.window.showErrorMessage(
            `${fldrPath} exists but is not a directory`
          );
        }
      } else {
        fs.mkdirSync(fldrPath);
      }
      let fileName = `${fldrPath}/sample.js`;
      fs.writeFileSync(
        fileName,
        fs.readFileSync(path.join(__dirname, "../../assets/sample.js"))
      );
      return vscode.workspace.openTextDocument(fileName).then(doc => {
        return vscode.window.showTextDocument(doc).then((editor) => {
            return editor.revealRange(
                new vscode.Range(30, 0, 30, 0),
                vscode.TextEditorRevealType.InCenter
            );
        })
      });
    })
  );

  new Resolver({ context }).attach();
}

// this method is called when your extension is deactivated
export function deactivate() {}
