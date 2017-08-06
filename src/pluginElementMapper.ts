import { InternalResolutionElement, ResolutionElement } from "./types";
import { CompletionItem, CompletionItemKind } from "vscode";

export const PluginElementMapper = new class {
  private maybePrefix = (v: string) => (v ? v + "." : "");
  internalToExternal = (ie: InternalResolutionElement): ResolutionElement => {
    return {
      comment: ie.comment,
      prefix: ie.prefix,
      sortToken: ie.sortToken,
      value: ie.value
    };
  };
  externalToInternal = (
    e: ResolutionElement,
    pluginName: string
  ): InternalResolutionElement => {
    return {
      pluginName: pluginName || null,
      comment: e.comment || null,
      prefix: e.prefix || null,
      sortToken: e.sortToken || e.value,
      value: e.value,
      label: `${this.maybePrefix(pluginName)}${this.maybePrefix(
        e.prefix
      )}${e.value}`,
      filterText: `${this.maybePrefix(pluginName)}${this.maybePrefix(
        e.prefix
      )}${e.value}`
    };
  };
  internalToCompletionItem = (
    ie: InternalResolutionElement,
    mutateItem?: CompletionItem
  ) => {
    let item =
      mutateItem || new CompletionItem(ie.label, CompletionItemKind.Value);
    item.documentation = ie.comment;
    item.sortText = ie.sortToken;
    item.insertText = ie.value;
    item.label = ie.label;
    item.filterText = ie.filterText;
    return item;
  };
  externalToCompletionItem = (e: ResolutionElement, pluginName: string) => {
    let internal = this.externalToInternal(e, pluginName);
    return this.internalToCompletionItem(internal);
  };
}();
