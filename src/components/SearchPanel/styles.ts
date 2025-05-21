import React from "react";

export const searchPanelContainer: React.CSSProperties = {
    position: "absolute",
    right: 16,
    top: 14,
    zIndex: 10,
    background: "#26292f",
    border: "1px solid #333",
    borderRadius: 5,
    padding: "0 6px",
    display: "flex",
    alignItems: "center",
    gap: 3,
    width: 196,
    boxShadow: "0 2px 8px #1118",
    fontSize: 13,
    minHeight: 28,
    height: 28,
};

export const searchInput: React.CSSProperties = {
    background: "transparent",
    color: "#fff",
    border: "none",
    outline: "none",
    fontSize: 13,
    flex: 1,
    padding: "2px 0",
    height: 22,
    minWidth: 0,
};

export const resultLabel: React.CSSProperties = {
    color: "#888",
    minWidth: 32,
    textAlign: "center",
    fontSize: 12,
    padding: "0 2px"
};

export const navButtonBase: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: 13,
    width: 20,
    height: 20,
    lineHeight: "20px",
    borderRadius: 4,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

export const navButtonActive: React.CSSProperties = {
    ...navButtonBase,
    color: "#aaa",
    opacity: 1,
    cursor: "pointer",
};

export const navButtonDisabled: React.CSSProperties = {
    ...navButtonBase,
    color: "#aaa",
    opacity: 0.3,
    cursor: "default",
};