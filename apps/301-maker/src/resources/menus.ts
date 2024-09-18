import {commands as c} from "./commands.ts";
import ICommandEnabler from "../framework/contracts/ICommandEnabler.ts";
import {makeCommandMenuItem} from "../framework/menu/MenuHelpers.ts";
import {CommandBus} from "../framework/command/CommandBus.ts";
import {Command} from "../framework/command/Command.ts";

function buildMenu(enabler: ICommandEnabler, bus: CommandBus, label: string, items: (Command | {separator: true})[]) {
    const I = (command: Command | {separator: true}) => "separator" in command ? command : makeCommandMenuItem(command, enabler, bus);
    return {
        label,
        items: items.map(I)
    };
}

const sep : {separator: true} = {separator: true};
export function Main(enabler: ICommandEnabler, bus: CommandBus) {
    return [buildMenu(enabler, bus, "File", [
        c.FILE_NEW,
        c.FILE_OPEN,
        sep,
        c.FILE_SAVE,
        c.FILE_SAVE_AS,
        sep,
        c.FILE_CLOSE,
        sep,
        c.FILE_QUIT
    ])];
}
