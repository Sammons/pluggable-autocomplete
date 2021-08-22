"use strict";
import { Resolver } from "./resolver";
import { C } from "./constants";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const InitFile = assetFile => {
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
  let fileName = `${fldrPath}/${assetFile}`;
  fs.writeFileSync(
    fileName,
    fs.readFileSync(path.join(__dirname, `../../assets/${assetFile}`))
  );
  return vscode.workspace.openTextDocument(fileName).then(doc => {
    return vscode.window.showTextDocument(doc).then(editor => {
      return editor.revealRange(
        new vscode.Range(30, 0, 30, 0),
        vscode.TextEditorRevealType.InCenter
      );
    });
  });
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log("activate");

  context.subscriptions.push(
    vscode.commands.registerCommand(C.contribPostgres, () => {
      return InitFile('postgres.js')
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(C.initialize, () => {
      return InitFile('sample.js')
    })
  );

  new Resolver({ context }).attach();
}

// this method is called when your extension is deactivated
export function deactivate() {}
