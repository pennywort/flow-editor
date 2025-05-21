import React, {CSSProperties, JSX} from "react";
const styles: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    border: '1px solid #ffe400',
    borderRadius: 4,
    background: 'rgba(255, 235, 59, 0.2)',
    color: 'inherit',
    padding: '1px 1px',
    margin: '0 1px',
    fontWeight: 'inherit',
    lineHeight: '0.9em'
}

export function highlightText(text: string, search: string): (string | JSX.Element)[] {
    if (!search) return [text];
    const lowerText = text.toLowerCase();
    const lowerSearch = search.toLowerCase();
    if (!lowerSearch) return [text];

    const parts: (string | JSX.Element)[] = [];
    let lastIdx = 0;
    let idx = lowerText.indexOf(lowerSearch);

    while (idx !== -1) {
        if (idx > lastIdx) parts.push(text.slice(lastIdx, idx));
        parts.push(
            <span key={`highlight-${idx}`} style={styles}>
                {text.slice(idx, idx + search.length)}
            </span>
        );
        lastIdx = idx + search.length;
        idx = lowerText.indexOf(lowerSearch, lastIdx);
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts;
}

export function highlightChildren(children: React.ReactNode, search: string): React.ReactNode {
    if (!search) return children;
    if (Array.isArray(children)) {
        return children.map((child, idx) =>
            typeof child === "string" ? highlightText(child, search) : child
        );
    }
    return typeof children === "string" ? highlightText(children, search) : children;
}
