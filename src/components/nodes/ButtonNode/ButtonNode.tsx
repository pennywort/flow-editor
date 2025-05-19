import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { BaseNode } from '../BaseNode/BaseNode';
import { ButtonNodeData } from '../../../models/ButtonNodeModel';
import { NodeButton } from '../../../models/BaseNodeModel';
import externalIcon from './external.svg';
import CollapseIcon from "../../CollapseIcon/CollapseIcon";
import { useCollapse } from "../../hooks";

import * as styles from './styles';

export type ButtonNodeType = Node<ButtonNodeData>;
export type ButtonNodeProps = NodeProps<ButtonNodeType> & {
    onDelete?: () => void;
    onEdit?: () => void;
};

const ExternalButton: React.FC<{ label: string }> = ({ label }) => (
    <div style={styles.link}>
        <img src={externalIcon} alt={''} />
        <ReactMarkdown
            components={{
                a: (props) => (
                    <a
                        {...props}
                        style={styles.externalLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {props.children}
                    </a>
                ),
                p: ({ children }) => (
                    <span style={styles.labelEllipsis}>{children}</span>
                ),
            }}
        >
            {label}
        </ReactMarkdown>
    </div>
);

export const ButtonNode: React.FC<ButtonNodeProps> = ({
                                                          data,
                                                          id,
                                                          selected,
                                                          onDelete,
                                                          onEdit,
                                                          ...rest
                                                      }) => {
    const { expanded, toggle, displayedText, needCollapse } = useCollapse(data.richText || '', 128);

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
                        <a {...props}
                           style={styles.externalLink}
                           target="_blank"
                           rel="noreferrer">{props.children}</a>
                    ),
                }}
            >
                {displayedText}
            </ReactMarkdown>
            {needCollapse && (
                <div style={styles.collapseIconRow}>
                    <CollapseIcon expanded={expanded} onClick={toggle} />
                </div>
            )}
            <div style={styles.buttonsContainer}>
                {(data.buttons ?? []).map((btn: NodeButton, i: number) => (
                    <div key={i} style={styles.buttonWrapper}>
                        {btn.target && (
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`btn-${i}`}
                                style={styles.handle}
                            />
                        )}
                        {btn.external ? (
                            <ExternalButton label={btn.label} />
                        ) : (
                            <button style={styles.button}>
                                <span style={styles.labelEllipsis} title={btn.label}>
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

export default memo(ButtonNode);
