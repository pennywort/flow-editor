import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { BaseNode } from '../BaseNode/BaseNode';
import { ButtonNodeData } from '../../../models/ButtonNodeModel';
import { NodeButton } from '../../../models/BaseNodeModel';
import { buttonNodeStyles } from './styles';
import externalIcon from './external.svg';

export type ButtonNodeType = Node<ButtonNodeData>;
export type ButtonNodeProps = NodeProps<ButtonNodeType> & {
    onDelete?: () => void;
    onEdit?: () => void;
};

export const ButtonNode: React.FC<ButtonNodeProps> = ({
                                                          data,
                                                          id,
                                                          selected,
                                                          onDelete,
                                                          onEdit,
                                                          ...rest
                                                      }) => {
    return (
        <BaseNode
            data={data}
            id={id}
            selected={selected}
            onDelete={onDelete}
            onEdit={onEdit}
            {...rest}
        >
            <ReactMarkdown
                components={{
                    a: (props) => (
                        <a {...props} style={{ color: '#4CAF50' }} target="_blank" rel="noreferrer" />
                    ),
                }}
            >
                {data.richText}
            </ReactMarkdown>
            <div style={buttonNodeStyles.buttonsContainer}>
                {(data.buttons ?? []).map((btn: NodeButton, i: number) => (
                    <div key={i} style={buttonNodeStyles.buttonWrapper}>
                        {btn.target && (
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`btn-${i}`}
                                style={buttonNodeStyles.handle}
                            />
                        )}
                        {btn.external ? (
                            <div style={buttonNodeStyles.link}>
                                <img src={externalIcon} alt={''} style={{ marginRight: 4 }} />
                                <span style={buttonNodeStyles.labelEllipsis} title={btn.label}>
                                    {btn.label}
                                </span>
                            </div>
                        ) : (
                            <button style={buttonNodeStyles.button}>
                                <span style={buttonNodeStyles.labelEllipsis} title={btn.label}>
                                    {btn.label}
                                </span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </BaseNode>
    );
};
