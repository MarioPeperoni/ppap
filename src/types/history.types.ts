export interface Command {
  readonly label: string;
  apply: () => void;
  revert: () => void;
}

export interface History {
  readonly past: readonly Command[];
  readonly future: readonly Command[];
}

export interface HistoryStep {
  history: History;
  command: Command | null;
}
