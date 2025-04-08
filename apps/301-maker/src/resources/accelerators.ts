// use react-hotkeys

import {Accel, formatLabel, Modifier} from "../ui/Accel.ts";
import {Command} from "../framework/command/Command.ts";
import {commands} from "./commands.ts";

function mkaccel(key: string, ...modifiers: Modifier[]) : Accel {
    return {key, modifiers};
}

const accelerators:  { [k: keyof typeof commands] : Accel } = {
    FILE_NEW:       mkaccel('N','Ctrl'),
    FILE_OPEN:      mkaccel('O','Ctrl'),
    FILE_SAVE:      mkaccel('S','Ctrl'),
    FILE_SAVE_AS:   mkaccel('S','Ctrl','Shift'),
    FILE_CLOSE:     mkaccel('W','Ctrl'),
    FILE_QUIT:      mkaccel('Q','Ctrl')
};

export const accelTable : { [k: keyof typeof accelerators & keyof typeof commands] : Command }
    = Object.fromEntries(Object.keys(accelerators).map(
        (k) => [formatLabel(accelerators[k]).toLowerCase(), commands[k]])
    );

export default accelerators