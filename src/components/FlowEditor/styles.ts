import React from "react";

export const rootContainer: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(30, 30, 30)',
    position: 'relative',
};

export const searchPanelContainer: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: 'auto'
}
