import { C } from "./constants";
import { ErrorResult, ResolverPluginLoader } from "./resolverPluginLoader";
import { ResolverPlugin, ResolutionElement } from "./types";
import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  ProviderResult,
  CompletionItem,
  CompletionList,
  HoverProvider,
  Hover
} from "vscode";
import { PluginElementMapper } from "./pluginElementMapper";

export class Resolver implements CompletionItemProvider {
  constructor(
    private params: {
      context: vscode.ExtensionContext;
    }
  ) {}

  resolveFilePath(file: string) {
    file = file.replace("~", os.homedir());
    return path.resolve(file);
  }

  plugins: ResolverPlugin[] = [];
  config: vscode.WorkspaceConfiguration;
  async initialize() {
    let selectionItems: vscode.CompletionList = new vscode.CompletionList();
    this.config = vscode.workspace.getConfiguration("pluggableautocomplete");
    const jsonFileConfig = this.config.get<string>("json", null);
    if (jsonFileConfig) {
      const jsonFilePath = this.resolveFilePath(jsonFileConfig);
      console.log(`Turning on json mode, looking in dir ${jsonFilePath}`);
      this.plugins = [
        await new ResolverPluginLoader().wrapJsonFile(
          this.params.context,
          jsonFilePath
        )
      ];
    } else {
      let plugins = await new ResolverPluginLoader().loadPlugins(
        this.params.context
      );

      if (Array.isArray(plugins)) {
        let isFailedPlugin = (plugin): plugin is ErrorResult =>
          plugin.code != null;
        let isNotFailedPlugin = (plugin): plugin is ResolverPlugin =>
          plugin.code == null;

        let errorPlugins = plugins.filter(isFailedPlugin);
        errorPlugins.forEach(errorPlug => {
          vscode.window.showInformationMessage(
            `Plugin Load Error ${errorPlug.code} ${errorPlug.error}`
          );
        });

        let successPlugins = plugins.filter(isNotFailedPlugin);
        if (successPlugins.length === 0) {
          return vscode.window.showInformationMessage(
            `No plugins found. Try running "Create Sample Pluggable Autocomplete" to make one.`
          );
        } else {
          this.plugins = successPlugins;
        }
      } else if (plugins) {
        return vscode.window.showErrorMessage(plugins.code);
      }
    }
  }

  attach() {
    return this.initialize().then(() => {
      this.params.context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          { scheme: "file" },
          this
        )
      );
      this.params.context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          { scheme: "untitled" },
          this
        )
      );
    });
  }

  provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<CompletionItem[] | CompletionList> {
    return new Promise((resolve, reject) => {
      token.onCancellationRequested(() => {
        resolve(null);
      });

      let results = async () => {
        let shouldStopEarly = () => token.isCancellationRequested;

        let resolved = this.plugins.map(p => ({
          items: p.resolveItems(shouldStopEarly),
          pluginName: p.name
        }));

        let resolvedMappedToInternal = await Promise.all(
          resolved.map(async resolvedElements => {
            let items = await resolvedElements.items;
            return items.map(element =>
              PluginElementMapper.externalToInternal(
                element,
                resolvedElements.pluginName
              )
            );
          })
        );

        let resolvedMapped = resolvedMappedToInternal.reduce(
          (a, b) => a.concat(b),
          []
        );
        return resolvedMapped.map(e =>
          PluginElementMapper.internalToCompletionItem(e)
        );
      };
      results()
        .then(values => {
          if (!token.isCancellationRequested) {
            resolve(values);
          }
        })
        .catch(error => {
          if (!token.isCancellationRequested) {
            reject(error);
          }
        });
    });
  }

  dispose() {
    console.log("disposed");
  }
}
