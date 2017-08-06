
export interface ResolutionElement {
  prefix: string;
  value: string;
  comment: string;
  sortToken: string;
}

export interface InternalResolutionElement {
  pluginName: string;
  prefix: string;
  value: string;
  comment: string;
  sortToken: string;
  label: string;
  filterText: string;
}

export interface ResolverPlugin {
  name?: string;
  resolveItems: (
    shouldStopEarly: () => boolean
  ) => PromiseLike<ResolutionElement[]> | ResolutionElement[] | null;
  furtherResolveItem?: (
    element: ResolutionElement,
    shouldStopEarly: () => boolean
  ) => PromiseLike<ResolutionElement> | ResolutionElement | null;
}