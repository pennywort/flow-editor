import React from "react";

export const panelContainer: React.CSSProperties = {
    display: "flex",
    gap: 8,
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
};

export const buttonBase: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 6,
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #0002',
};

export const saveButton: React.CSSProperties = {
    ...buttonBase,
    background: '#007BFF',
};

export const autoLayoutButton: React.CSSProperties = {
    ...buttonBase,
    background: '#1CB65D',
};

export const uploadButton: React.CSSProperties = {
    ...buttonBase,
    background: '#9147FF',
};

export const select: React.CSSProperties = {
    padding: '6px',
    borderRadius: 6,
    border: '1px solid #888',
    background: '#222',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
};

export const rootContainer: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(30, 30, 30)',
    position: 'relative',
};

export const searchPanelContainer: React.CSSProperties = {
    position: 'absolute',
    top: 20,
    right: 30,
    zIndex: 10,
    width: 260,
    pointerEvents: 'auto'
}

export const miniMapContainer: React.CSSProperties = { backgroundColor: 'rgb(0,0,0)' }