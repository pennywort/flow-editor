import { CSSProperties } from "react";

export const overlay: CSSProperties = {
    position: "fixed",
    zIndex: 10000,
    left: 0, top: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

export const dialog: CSSProperties = {
    background: "#232324",
    borderRadius: 10,
    minWidth: 340,
    maxWidth: 420,
    padding: 24,
    boxShadow: "0 6px 32px #000a",
    color: "#fff"
};

export const title: CSSProperties = {
    fontWeight: 600,
    fontSize: 19,
    marginBottom: 10,
};

export const content: CSSProperties = {
    marginBottom: 18,
    fontSize: 15,
};

export const actions: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
};

export const button: CSSProperties = {
    padding: "7px 16px",
    borderRadius: 7,
    border: "none",
    fontWeight: 600,
    background: "#343436",
    color: "#fff",
    cursor: "pointer",
    fontSize: 15
};

export const primaryButton: CSSProperties = {
    background: "#1877F2",
    color: "#fff",
};

export const checkboxLabel: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 14,
    marginBottom: 10,
};

export const checkbox: CSSProperties = {
    accentColor: "#1877F2",
    width: 17,
    height: 17
};
