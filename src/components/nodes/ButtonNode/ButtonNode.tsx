import React, { memo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import BaseNode from "../BaseNode/BaseNode";
import { ButtonNodeData } from '../../../models/ButtonNodeModel';
import { NodeButton } from '../../../models/BaseNodeModel';
import CollapseIcon from "../../CollapseIcon/CollapseIcon";
import * as styles from './styles';
import { stringCutOff } from "../../../utils";
import ExternalButton from "./ExternalButton";
import { useSearch } from "../../../context/SearchContext";
import { highlightText } from "../../../utils/highlight";

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
    const { search } = useSearch();

    // useEffect(() => {
    //     if (
    //         search &&
    //         !expanded &&
    //         data.richText &&
    //         data.richText.toLowerCase().indexOf(search.toLowerCase()) > 127 &&
    //         onCollapse
    //     ) {
    //         onCollapse(id, false);
    //     }
    // }, [search, data.richText, expanded, onCollapse, id]);

    const handleCollapse = useCallback(() => {
        onCollapse && onCollapse(id, expanded);
    }, [onCollapse, id, expanded]);

    const displayText = !expanded ? stringCutOff(data.richText) : data.richText;

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
                    a: ({ children, ...props }) => {
                        const childText = Array.isArray(children)
                            ? children.map((child, idx) =>
                                typeof child === "string"
                                    ? highlightText(child, search)
                                    : child
                            )
                            : typeof children === "string"
                                ? highlightText(children, search)
                                : children;
                        return (
                            <a {...props}
                               style={styles.externalLink}
                               target="_blank"
                               rel="noreferrer">{childText}</a>
                        );
                    },
                    p: ({ children }) => (
                        <p>
                            {Array.isArray(children)
                                ? children.map((child, idx) =>
                                    typeof child === "string"
                                        ? highlightText(child, search)
                                        : child
                                )
                                : typeof children === "string"
                                    ? highlightText(children, search)
                                    : children}
                        </p>
                    ),

                    h1: ({ children }) => (
                        <h1>
                            {Array.isArray(children)
                                ? children.map((child, idx) =>
                                    typeof child === "string"
                                        ? highlightText(child, search)
                                        : child
                                )
                                : typeof children === "string"
                                    ? highlightText(children, search)
                                    : children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2>
                            {Array.isArray(children)
                                ? children.map((child, idx) =>
                                    typeof child === "string"
                                        ? highlightText(child, search)
                                        : child
                                )
                                : typeof children === "string"
                                    ? highlightText(children, search)
                                    : children}
                        </h2>
                    ),
                    text: ({ children }) => <>{highlightText(children as string, search)}</>
                }}
            >
                {displayText}
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
                                    {highlightText(btn.label, search)}
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
