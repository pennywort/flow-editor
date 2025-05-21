import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import React, { CSSProperties, memo, type ReactNode } from 'react';
import { baseNodeStyles } from './styles';
import deleteIcon from './delete.svg';
import editIcon from './edit.svg';
import { useSearch } from "../../../context/SearchContext";
import {highlightText} from "../../../utils/highlight";

export type BaseNodeType = Node<{ label: string }>;
export type BaseNodeProps = NodeProps<BaseNodeType> & {
    children?: ReactNode;
    text?: string;
    style?: { container: CSSProperties; label: CSSProperties };
    onDelete?: () => void;
    onEdit?: () => void;
};

const BaseNode = (props: BaseNodeProps) => {
    const {
        data,
        children,
        text,
        style,
        onDelete,
        onEdit,
    } = props;

    const { search } = useSearch();

    const mergedContainerStyles = {
        ...baseNodeStyles.nodeContainer,
        ...style?.container,
    };

    const mergedLabelStyles = {
        ...baseNodeStyles.labelContainer,
        ...style?.label,
    };

    return (
        <div>
            <div style={mergedLabelStyles}>
                <span style={baseNodeStyles.headerEllipsis}>
                    {highlightText(data.label, search)}
                </span>
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                    <img
                        src={editIcon}
                        alt=""
                        onClick={onEdit}
                        style={{ cursor: 'pointer', marginRight: 6 }}
                    />
                    <img
                        src={deleteIcon}
                        alt=""
                        onClick={onDelete}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>
            <div style={mergedContainerStyles}>
                <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
                {text
                    ? highlightText(text, search)
                    : children}
            </div>
        </div>
    );
};

export default memo(BaseNode);
