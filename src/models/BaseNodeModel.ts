import { Node } from '@xyflow/react';
import React from "react";

export interface NodeButton {
    label: string;
    target?: string;
    external?: boolean;
    href?: string;
}

export interface BaseNodeData extends Record<string, unknown> {
    label: string;
}

export class BaseNodeModel<T extends BaseNodeData = BaseNodeData> implements Node<T> {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: T;
    style: React.CSSProperties;

    constructor(config: {
        id: string;
        type: string;
        position: { x: number; y: number };
        data: T;
        style?: React.CSSProperties;
    }) {
        this.id = config.id;
        this.type = config.type;
        this.position = config.position;
        this.data = config.data;
        this.style = this.getBaseStyle(config.style);
    }

    protected getBaseStyle(customStyles?: React.CSSProperties): React.CSSProperties {
        return {
            backgroundColor: 'rgb(0, 0, 0)',
            paddingLeft: '3px',
            color: '#fff',
            borderRadius: 8,
            width: 280,
            ...customStyles,
        };
    }
}