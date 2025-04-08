import { load, Store } from "@tauri-apps/plugin-store";
import { attachConsole, debug } from "@tauri-apps/plugin-log";

await attachConsole();
await debug('Initializing state store');
const stateStore = await load('app-state.json', { autoSave: true });
if (!stateStore) {
    throw new Error("Failed to initialize state store");
}
await debug('Initialized state store');
export default stateStore satisfies Store;

