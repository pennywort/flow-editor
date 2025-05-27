import { Edge, MarkerType, Node } from '@xyflow/react';

import { ButtonNodeData, ButtonNodeModel } from '../../models/ButtonNodeModel';
import { NodeButton } from '../../models/BaseNodeModel';

const STORAGE_KEY = 'flow_nodes_v1';

export function getInitialNodes(): Node<ButtonNodeData>[] {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (raw) {
		try {
			const nodes: Node<ButtonNodeData>[] = JSON.parse(raw);
			const idToLabel: Record<string, string> = {};
			nodes.forEach(n =>
				(n.data.buttons ?? []).forEach(btn => {
					if (btn.target) {
						idToLabel[btn.target] = btn.label;
					}
				})
			);
			return nodes.map(n => ({
				...n,
				data: {
					...n.data,
					label: n.id === 'menu' //TODO: сделать id изменяемым?
						? n.data.label
						: idToLabel[n.id] ?? n.data.label ?? '',
				}
			}));
		} catch { /* empty */ }
	}
	return [
		new ButtonNodeModel(
			'menu', //TODO: сделать id изменяемым?
			'Приветственное сообщение',
			{ x: 50, y: 50 },
			`Это первый блок. Вы можете его редактировать и добавлять кнопки.`,
		),
	];
}

export function saveNodesToStorage(nodes: Node<ButtonNodeData>[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}

export function getEdgesFromNodes(nodes: Node<ButtonNodeData>[], edgeType: string): Edge[] {
	return nodes.flatMap((node) => {
		const nodeButtons = (node.data as ButtonNodeData).buttons ?? [];
		return nodeButtons.map((b: NodeButton, idx: number) => {
			if (!b.target) {
				return null;
			}
			return {
				id: `e-${node.id}-btn-${idx}`,
				source: node.id,
				target: b.target,
				sourceHandle: `btn-${idx}`,
				targetHandle: null,
				type: edgeType,
				markerEnd: {
					type: MarkerType.Arrow,
					width: 16,
					height: 16,
					color: '#007BFF',
				},
				style: {
					stroke: '#007BFF',
					strokeWidth: 2,
				},
			} as Edge;
		}).filter(Boolean) as Edge[];
	});
}
