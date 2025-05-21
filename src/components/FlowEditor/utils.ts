import {Edge, MarkerType, Node} from "@xyflow/react";
import {ButtonNodeData, ButtonNodeModel} from "../../models/ButtonNodeModel";
import {NodeButton} from "../../models/BaseNodeModel";

const STORAGE_KEY = "flow_nodes_v1";

export function getInitialNodes(): Node<ButtonNodeData>[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const nodes: Node<ButtonNodeData>[] = JSON.parse(raw);
            const idToLabel: Record<string, string> = {};
            nodes.forEach(n =>
                (n.data.buttons ?? []).forEach(btn => {
                    if (btn.target) idToLabel[btn.target] = btn.label;
                })
            );
            return nodes.map(n => ({
                ...n,
                data: {
                    ...n.data,
                    label: n.id === '1'
                        ? n.data.label
                        : idToLabel[n.id] ?? n.data.label ?? "",
                }
            }));
        } catch {}
    }
    return [
        new ButtonNodeModel(
            '1',
            'Приветственное сообщение',
            { x: 50, y: 50 },
            `Ответ на ваш вопрос представлен на [Confluence](https://confluence.example.com)`,
            [
                { label: 'Действие 1', target: '2' },
                { label: 'Действие 2', target: '3' },
                { label: 'Внешняя ссылка', external: true },
            ]
        ),
        new ButtonNodeModel('2', 'Действие 1', { x: 500, y: 30 }, `**Ответ по действию 1**`),
        new ButtonNodeModel('3', 'Действие 2', { x: 500, y: 150 }, `**Ответ по действию 2**`),
    ];
}

export function saveNodesToStorage(nodes: Node<ButtonNodeData>[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}

export function getEdgesFromNodes(nodes: Node<ButtonNodeData>[], edgeType: string): Edge[] {
    return nodes.flatMap((node) => {
        const nodeButtons = (node.data as ButtonNodeData).buttons ?? [];
        return nodeButtons.map((b: NodeButton, idx: number) => {
            if (!b.target) return null;
            return {
                id: `e-${node.id}-btn-${idx}`,
                source: node.id,
                target: b.target!,
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
