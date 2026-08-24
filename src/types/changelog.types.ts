export interface ReleaseSection {
  title: string;
  items: string[];
}

export interface Release {
  version: string;
  date: string;
  sections: ReleaseSection[];
}
