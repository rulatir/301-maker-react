export type Modifier = "Ctrl"|"Alt"|"Shift"|"Meta"
export type Accel = {
    modifiers: Modifier[],
    key: string
}

export type ModifierMap = {
    [k in Modifier]: number;
};

const modifierOrder: ModifierMap = {
    "Ctrl":     0,
    "Alt":      1,
    "Meta":     2,
    "Shift":    3
};

export const formatLabel = (a?: Accel) => a ? [
    ...[...new Set(a.modifiers)].sort((a: Modifier, b: Modifier)=>modifierOrder[a]-modifierOrder[b]),
    a.key
].join('+') : "";
