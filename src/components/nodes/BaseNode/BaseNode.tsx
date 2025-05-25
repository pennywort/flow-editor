import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import React, { CSSProperties, memo, type ReactNode } from 'react';
import { baseNodeStyles } from './styles';
import { ReactComponent as DeleteSvg } from "../../shared/svg/delete.svg";
import {ReactComponent as EditSvg} from '../../shared/svg/edit.svg';
import { useSearch } from "../../../context/SearchContext";
import { MarkdownRenderer, SvgIcon } from "../../shared";

export type BaseNodeType = Node<{ label: string }>;
export type BaseNodeProps = NodeProps<BaseNodeType> & {
    children?: ReactNode;
    text?: string;
    style?: { container: CSSProperties; label: CSSProperties };
    onDelete?: (nodeId: string) => void;
    onEdit?: (nodeId: string) => void;
};

const BaseNode = (props: BaseNodeProps) => {
    const {
        data,
        children,
        text,
        style,
        onDelete,
        onEdit,
        id
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

    const handleEdit = (nodeId: string) => {
        onEdit && onEdit(nodeId);
    }

    const handleDelete = (nodeId: string) => {
        if (nodeId === 'menu') { //TODO: сделать id изменяемым?
            return;
        }
        onDelete && onDelete(nodeId);
    }

    return (
        <div>
            <div style={mergedLabelStyles}>
                <MarkdownRenderer text={data.label} search={search} />
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                    <SvgIcon onClick={() => handleEdit(id)} >
                        <EditSvg />
                    </SvgIcon>
                    <SvgIcon onClick={() => handleDelete(id)}>
                        <DeleteSvg />
                    </SvgIcon>
                </div>
            </div>
            <div style={mergedContainerStyles}>
                <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
                {text
                    ? (
                        <MarkdownRenderer text={text} search={search} />
                    )
                    : children}
            </div>
        </div>
    );
};

export default memo(BaseNode);
