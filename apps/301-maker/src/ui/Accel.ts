export type Modifier = "Ctrl"|"Alt"|"Shift"|"Meta"
export type Accel = {
    modifiers: Modifier[],
    key: string
}

export type ModifierMap<T> = {
    [k in Modifier]: T;
};

export const modifierOrder: ModifierMap<number> = {
    "Ctrl":     0,
    "Alt":      1,
    "Meta":     2,
    "Shift":    3
};

const modifierEventProps : ModifierMap<keyof KeyboardEvent> = {
    "Ctrl": "ctrlKey",
    "Alt": "altKey",
    "Meta": "metaKey",
    "Shift": "shiftKey"
};

export const formatLabel = (a?: Accel) => a ? [
    ...[...new Set(a.modifiers)].sort((a: Modifier, b: Modifier)=>modifierOrder[a]-modifierOrder[b]),
    a.key
].join('+') : "";

export function eventToAccel(e: KeyboardEvent): Accel {
    const modifiers = [] as Modifier[];
    for (const modifier in modifierEventProps) {
        if (e[modifierEventProps[modifier as Modifier]]) {
            modifiers.push(modifier as Modifier);
        }
    }
    return { modifiers, key: e.key };
}
export function stringToAccel(s: string): Accel {
    const parts = s.split('+');
    const key = parts.pop() as string;
    const modifiers = parts as Modifier[];

    // Validate modifiers
    modifiers.forEach(modifier => {
        if (!(modifier in modifierOrder)) {
            throw new Error(`Invalid modifier: ${modifier}`);
        }
    });

    // Normalize order
    const sortedModifiers = [...new Set(modifiers)].sort((a, b) => modifierOrder[a] - modifierOrder[b]);

    return { modifiers: sortedModifiers, key };
}

export function matchKeyEvent(e: KeyboardEvent, a: Accel|string): boolean {
    return formatLabel(typeof a === "string" ? stringToAccel(a) : a) === formatLabel(eventToAccel(e));
}

