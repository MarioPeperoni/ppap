export interface ReleaseSection {
  title: string;
  items: string[];
}

export interface Release {
  version: string;
  subtitle?: string;
  sections: ReleaseSection[];
}
