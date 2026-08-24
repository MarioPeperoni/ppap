class SaveQueue {
  private readonly running = new Map<string, Promise<void>>();
  private readonly queued = new Map<string, () => Promise<void>>();

  push(key: string, task: () => Promise<void>): Promise<void> {
    this.queued.set(key, task);
    this.start(key);

    return this.idle(key);
  }

  async drain(): Promise<void> {
    while (this.running.size > 0 || this.queued.size > 0) {
      for (const key of [...this.queued.keys()]) this.start(key);
      await Promise.allSettled([...this.running.values()]);
    }
  }

  private start(key: string): void {
    if (this.running.has(key)) return;

    const task = this.queued.get(key);
    if (task === undefined) return;

    this.queued.delete(key);
    const run = task()
      .catch((error: unknown) => {
        console.error(`Failed to write ${key}`, error);
      })
      .finally(() => {
        this.running.delete(key);
        this.start(key);
      });

    this.running.set(key, run);
  }

  private async idle(key: string): Promise<void> {
    let run = this.running.get(key);

    while (run !== undefined) {
      await run;
      run = this.running.get(key);
    }
  }
}

export const saveQueue = new SaveQueue();
