import {error} from "@tauri-apps/plugin-log";
import inspect from "browser-util-inspect";

export function handler<E extends Event>(callback: (event: E) => Promise<void>): (event: E) => Promise<void> {
    return async (event: E) => {
        try {
            await callback(event);
        } catch (err) {
            await error(inspect(err));
        }
    };
}