import { attachConsole } from '@tauri-apps/plugin-log';

export async function forwardConsoleToTauri() {
    await attachConsole();
}

