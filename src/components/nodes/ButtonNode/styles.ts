import { CSSProperties } from 'react';

export const buttonNodeStyles: {
    buttonsContainer: CSSProperties;
    buttonWrapper: CSSProperties;
    handle: CSSProperties;
    link: CSSProperties;
    button: CSSProperties;
} = {
    buttonsContainer: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
    },
    buttonWrapper: {
        position: 'relative'
    },
    handle: {
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#007BFF',
        width: 10,
        height: 10,
        border: 'none',
        zIndex: 2
    },
    link: {
        display: 'block',
        background: '#333',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: 4,
        textDecoration: 'none',
        textAlign: 'center',
        fontSize: 13
    },
    button: {
        width: '100%',
        background: '#444',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 13
    }
};