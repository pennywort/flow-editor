import { CSSProperties } from 'react';

export const baseNodeStyles: {
    container: CSSProperties;
    label: CSSProperties;
} = {
    container: {
        backgroundColor: '#000',
        color: '#fff',
        padding: '5px 0px 5px 3px',
        borderRadius: 8,
        width: 285,
        fontSize: 14,
        position: 'relative',
        boxSizing: 'border-box'
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 8
    }
};