import ReactMarkdown from 'react-markdown';
import { Handle, Position } from '@xyflow/react';
import { BaseNodeData } from '../../../models/BaseNodeModel';
import * as React from "react";

type Props = {
    id: string;
    data: BaseNodeData;
};

export const ButtonNode: React.FC<Props> = ({ id, data }) => (
    <div
        style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: 10,
            borderRadius: 8,
            width: 280,
            fontSize: 14,
            position: 'relative',
            boxSizing: 'border-box',
        }}
    >
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{data.label}</div>
        <ReactMarkdown
            components={{
                a: (props) => (
                    <a {...props} style={{ color: '#4CAF50' }} target="_blank" rel="noreferrer" />
                ),
            }}
        >
            {data.richText}
        </ReactMarkdown>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.buttons?.map((btn, i) => (
                <div key={i} style={{ position: 'relative' }}>
                    {btn.target && (
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={`btn-${i}`}
                            style={{
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: '#007BFF',
                                width: 10,
                                height: 10,
                                border: 'none',
                                boxShadow: 'none',
                                zIndex: 2,
                            }}
                        />
                    )}
                    {btn.external ? (
                        <a
                            href={btn.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'block',
                                background: '#333',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: 4,
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontSize: 13,
                            }}
                        >
                            {btn.label}
                        </a>
                    ) : (
                        <button
                            style={{
                                width: '100%',
                                background: '#444',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 13,
                            }}
                        >
                            {btn.label}
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
);