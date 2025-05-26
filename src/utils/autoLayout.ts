import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

const nodeWidth = 360;
const nodeHeight = 200;

export function getLayoutedElements<T extends Record<string, unknown>>(
	nodes: Node<T>[],
	edges: Edge[],
	direction: 'TB' | 'LR' = 'TB'
): Node<T>[] {
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));
	dagreGraph.setGraph({
		rankdir: direction,
		ranksep: 140,
		nodesep: 120,
	});

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	return nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		return {
			...node,
			position: {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			},
		};
	});
}
