// use react-hotkeys

import {Accel, Modifier} from "../ui/Accel.ts";

function mkaccel(key: string, ...modifiers: Modifier[]) : Accel {
    return {key, modifiers};
}
export default {
    FILE_NEW:       mkaccel('N','Ctrl'),
    FILE_OPEN:      mkaccel('O','Ctrl'),
    FILE_SAVE:      mkaccel('S','Ctrl'),
    FILE_SAVE_AS:   mkaccel('S','Ctrl','Shift'),
    FILE_CLOSE:     mkaccel('W','Ctrl'),
    FILE_QUIT:      mkaccel('Q','Ctrl')
};