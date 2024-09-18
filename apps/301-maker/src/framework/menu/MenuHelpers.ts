// src/MenuHelpers.ts
import { MenuItem } from 'primereact/menuitem';
import { Command } from '../command/Command.ts';
import { CommandBus } from '../command/CommandBus.ts';
import ICommandEnabler from "../contracts/ICommandEnabler.ts";

export function makeCommandMenuItem(
    command: Command,
    commandEnabler: ICommandEnabler,
    commandBus: CommandBus
): MenuItem {
    return {
        id: command.id,
        label: command.label,
        icon: `pi pi-fw pi-${command.icon}`,
        disabled: !commandEnabler.isCommandEnabled(command.id),
        command: () => {
            commandBus.fireCommand(command);
        },
    };
}