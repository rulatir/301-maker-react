import React, { ReactNode, ReactElement } from 'react';

function fixKeys(children: ReactNode): ReactNode {
    if (!Array.isArray(children)) {
        if (React.isValidElement(children)) {
            return fixElementKeys(children);
        }
        return children;
    }

    const childrenArray = children as ReactElement[];
    const existingKeys = new Set<string | number>();

    // First pass: Collect all existing keys
    for (const child of childrenArray) {
        if (React.isValidElement(child) && child.key != null) {
            existingKeys.add(child.key);
        }
    }

    // Second pass: Clone only elements that need a key
    return childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
            const newProps: any = {};
            if (child.key == null) {
                let newKey;
                do {
                    newKey = `auto-key-${index++}`;
                } while (existingKeys.has(newKey));
                newProps.key = newKey;
                existingKeys.add(newKey);
            }
            if ((child.props as any).children) {
                newProps.children = fixKeys(React.Children.toArray((child.props as any).children));
            }
            return Object.keys(newProps).length > 0 ? React.cloneElement(child, newProps) : child;
        }
        return child;
    });
}

function fixElementKeys(element: ReactElement): ReactElement {
    const newProps: any = {};
    if (element.key == null) {
        newProps.key = `auto-key-${Math.random().toString(36).substr(2, 9)}`;
    }
    if ((element.props as any).children) {
        newProps.children = fixKeys(React.Children.toArray((element.props as any).children));
    }
    return Object.keys(newProps).length > 0 ? React.cloneElement(element, newProps) : element;
}

export default fixKeys;