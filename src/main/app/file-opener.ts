import { readFile } from 'node:fs/promises';
import { app, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { BOARD_EXTENSION } from '@/constants/library.constants';
import { boardRepository } from '@/main/library/file-board.repository';

class FileOpener {
  private queued: string | null = null;

  watch(): void {
    app.on('open-file', (event, filePath) => {
      event.preventDefault();
      this.open(filePath);
    });
  }

  fromArguments(argv: readonly string[]): void {
    const file = argv.find((argument) => argument.endsWith(BOARD_EXTENSION));
    if (file !== undefined) this.open(file);
  }

  open(filePath: string): void {
    this.queued = filePath;
    void this.deliver();
  }

  deliver(): Promise<void> {
    const filePath = this.queued;
    const [window] = BrowserWindow.getAllWindows();
    if (filePath === null || window === undefined) return Promise.resolve();

    this.queued = null;

    return this.adopt(window, filePath);
  }

  private async adopt(window: BrowserWindow, filePath: string): Promise<void> {
    try {
      const meta = await boardRepository.adopt(await readFile(filePath));
      window.webContents.send(IPC_CHANNELS.libraryOpenBoard, meta);
    } catch (error) {
      console.error(`Could not open ${filePath}`, error);
    }
  }
}

export const fileOpener = new FileOpener();
