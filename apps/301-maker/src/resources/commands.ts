import { Command } from "../framework/command/Command.ts";

const cmd = (label: string, icon?: string) => ({label, icon, id: ""});

const commands: {[k: string]: Command} = {
    FILE_NEW:       cmd("New", "plus"),
    FILE_OPEN:      cmd("Open", "folder-open"),
    FILE_SAVE:      cmd("Save", "save"),
    FILE_SAVE_AS:   cmd("Save as...", "save"),
    FILE_CLOSE:     cmd("Close", "times"),
    FILE_QUIT:      cmd("Quit", "sign-out"),
}

for(let id in commands) commands[id].id=id;


export {cmd, commands};
