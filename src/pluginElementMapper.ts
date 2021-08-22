import { InternalResolutionElement, ResolutionElement } from "./types";
import { CompletionItem, CompletionItemKind } from "vscode";

export const PluginElementMapper = new class {
  internalToExternal = (ie: InternalResolutionElement): ResolutionElement => {
    return {
      comment: ie.comment,
      prefix: ie.prefix,
      sortToken: ie.sortToken,
      value: ie.value
    };
  };
  externalToInternal = (
    e: ResolutionElement
  ): InternalResolutionElement => {
    const value = `${e.prefix || ""}${e.value}`;
    return {
      pluginName: e.prefix || null,
      comment: e.comment || null,
      prefix: e.prefix || null,
      sortToken: e.sortToken || value,
      value: value,
      label: value,
      filterText: value
    };
  };
  internalToCompletionItem = (
    ie: InternalResolutionElement,
    mutateItem?: CompletionItem
  ) => {
    let item =
      mutateItem || new CompletionItem(ie.label, CompletionItemKind.Value);
    item.detail = ie.comment  ? ie.comment.substr(0, 25) : null;
    item.documentation = ie.comment && ie.comment.length > 25 ? "..." + ie.comment.substr(25) : null;
    item.sortText = ie.sortToken;
    item.insertText = ie.value;
    item.label = ie.label;
    item.filterText = ie.filterText;
    return item;
  };
  externalToCompletionItem = (e: ResolutionElement) => {
    let internal = this.externalToInternal(e);
    return this.internalToCompletionItem(internal);
  };
}();
