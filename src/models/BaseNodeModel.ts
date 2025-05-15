import { Node, Position } from '@xyflow/react';
import * as React from "react";

export interface NodeButton {
    label: string;
    target?: string;
    external?: boolean;
    href?: string;
}

export interface BaseNodeData extends Record<string, unknown> {
    label: string;
    richText: string;
    buttons?: NodeButton[];
}

export abstract class BaseNodeModel<T extends BaseNodeData = BaseNodeData> implements Node<T> {
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
            backgroundColor: '#000',
            color: '#fff',
            padding: '5px 0px 5px 3px',
            borderRadius: 8,
            width: 285,
            ...customStyles,
        };
    }
}