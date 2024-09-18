// src/CommandEnabler.ts
import { makeAutoObservable } from 'mobx';
import ICommandEnabler from "../contracts/ICommandEnabler.ts";

export type EnablementPredicate = () => boolean | undefined;
export type EnablementPredicates = { [commandId: string]: EnablementPredicate };

export class CommandEnabler implements ICommandEnabler {
    next?: ICommandEnabler;
    enabled: boolean = true;
    private predicateMap: { [commandId: string]: EnablementPredicate };

    constructor(
        predicateMap?: { [commandId: string]: EnablementPredicate },
        next?: ICommandEnabler
    ) {
        this.predicateMap = predicateMap || {};
        this.next = next;
        makeAutoObservable(this);
    }

    isCommandEnabled(commandId: string): boolean {
        if (this.enabled) {
            const predicate = this.predicateMap[commandId];
            if (predicate) {
                const result = predicate();
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return this.next ? this.next.isCommandEnabled(commandId) : false;
    }

    // Method to update the predicateMap
    setPredicate(commandId: string, predicate: EnablementPredicate) {
        this.predicateMap[commandId] = predicate;
    }

    // Method to enable the CommandEnabler
    enable(enabled: boolean = true) : void {
        this.enabled = enabled
    }

    // Method to disable the CommandEnabler
    disable() : void {
        this.enable(false);
    }
}