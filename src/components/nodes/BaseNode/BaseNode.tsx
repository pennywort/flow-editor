import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import React, {CSSProperties, type ReactNode} from 'react';
import { baseNodeStyles } from './styles';
import deleteIcon from './delete.svg';
import editIcon from './edit.svg';

export type BaseNodeType = Node<{ label: string }>;
export type BaseNodeProps = NodeProps<BaseNodeType> & {
    children: React.ReactNode;
    style?: { container: CSSProperties, label: CSSProperties };
    onDelete?: () => void;
    onEdit?: () => void;
};

export function BaseNode(props: BaseNodeProps ) {
    const { data, children, style, onDelete, onEdit } = props;
    const mergedContainerStyles = { ...baseNodeStyles.nodeContainer, ...style?.container };
    const mergedLabelStyles = { ...baseNodeStyles.labelContainer, ...style?.label };

    return (
        <div>
            <div style={mergedLabelStyles}>
                <span style={baseNodeStyles.headerEllipsis}>
                  {data.label}
                </span>
                <div style={{ flexShrink: 0, marginLeft: 8}}>
                    <img src={editIcon} alt="" onClick={onEdit} style={{ cursor: 'pointer', marginRight: 6 }} />
                    <img src={deleteIcon} alt="" onClick={onDelete} style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div style={mergedContainerStyles}>
                <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
                {children}
            </div>
        </div>
    );
}
