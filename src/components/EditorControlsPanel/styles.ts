import React from "react";

export const buttonBase: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 6,
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #0002',
};

export const panelContainer: React.CSSProperties = {
    display: "flex",
    gap: 8,
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
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