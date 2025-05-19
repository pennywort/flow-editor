import { useState, useCallback, useMemo } from 'react';

export function useCollapse(text: string = '', maxLength: number = 128) {
    const [expanded, setExpanded] = useState(false);

    const toggle = useCallback(() => setExpanded(v => !v), []);
    const collapsed = useMemo(
        () =>
            !expanded && text && text.length > maxLength
                ? text.slice(0, maxLength) + '…'
                : text,
        [expanded, text, maxLength]
    );

    const needCollapse = !!text && text.length > maxLength;

    return {
        expanded,
        toggle,
        displayedText: collapsed,
        needCollapse,
    };
}
