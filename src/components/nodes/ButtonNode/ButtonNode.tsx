import React, { memo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import BaseNode from "../BaseNode/BaseNode";
import { ButtonNodeData } from '../../../models/ButtonNodeModel';
import { NodeButton } from '../../../models/BaseNodeModel';
import externalIcon from './external.svg';
import CollapseIcon from "../../CollapseIcon/CollapseIcon";
import * as styles from './styles';
import { stringCutOff } from "../../../utils";
import ExternalButton from "./ExternalButton";

export type ButtonNodeType = Node<ButtonNodeData>;
export type ButtonNodeProps = NodeProps<ButtonNodeType> & {
    onDelete?: () => void;
    onEdit?: () => void;
    onCollapse?: (nodeId: string, expanded: boolean) => void;
};

export const ButtonNode: React.FC<ButtonNodeProps> = ({
                                                          data,
                                                          onDelete,
                                                          onEdit,
                                                          onCollapse,
                                                          id,
                                                          ...rest
                                                      }) => {
    const expanded = !!data.expanded;

    const handleCollapse = useCallback(() => {
        onCollapse && onCollapse(id, expanded);
    }, [onCollapse, id, expanded]);

    return (
        <BaseNode
            id={id}
            data={data}
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
                {!expanded
                    ? stringCutOff(data.richText)
                    : data.richText}
            </ReactMarkdown>
            {data.richText.length > 128 && (
                <div style={styles.collapseIconRow}>
                    <CollapseIcon expanded={expanded} onClick={handleCollapse} />
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
