import { CSSProperties } from 'react';

export const buttonsContainer: CSSProperties = {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
};

export const buttonWrapper: CSSProperties = {
    position: 'relative',
};

export const externalLink: CSSProperties = {
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: 500,
};

export const handle: CSSProperties = {
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#007BFF',
    width: 10,
    height: 10,
    border: 'none',
    zIndex: 2,
};

export const button: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    background: '#444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    maxWidth: '100%',
    minWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

export const link: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    background: '#333',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 4,
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: 13,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
};

export const labelEllipsis: CSSProperties = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "block",
    flex: "1 1 auto",
    minWidth: 0,
};

export const collapseIconRow: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
};
