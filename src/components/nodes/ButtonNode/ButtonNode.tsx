import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

import BaseNode from '../BaseNode/BaseNode';
import { ButtonNodeData } from '../../../models/ButtonNodeModel';
import { NodeButton } from '../../../models/BaseNodeModel';
import CollapseIcon from '../../CollapseIcon/CollapseIcon';
import { stringCutOff } from '../../../utils';
import { useSearch } from '../../../context/SearchContext';
import { highlightText } from '../../../utils/highlight';
import { MarkdownRenderer } from '../../shared';

import ExternalButton from './ExternalButton';
import * as styles from './styles';

export type ButtonNodeType = Node<ButtonNodeData>;
export type ButtonNodeProps = NodeProps<ButtonNodeType> & {
    onDelete?: () => void;
    onEdit?: () => void;
    onCollapse?: (nodeId: string, expanded: boolean) => void;
};

const ButtonNode: React.FC<ButtonNodeProps> = ({
	data,
	onDelete,
	onEdit,
	onCollapse,
	id,
	...rest
}) => {
	const expanded = !!data.expanded;
	const { search } = useSearch();

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
			<MarkdownRenderer text={displayText} search={search} />
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
