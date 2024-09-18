// src/CommandBus.ts
import { Command } from './Command';

export class CommandBus extends EventTarget {
    fireCommand(command: Command) {
        const event = new CustomEvent(command.id, { detail: command });
        this.dispatchEvent(event);
    }
}