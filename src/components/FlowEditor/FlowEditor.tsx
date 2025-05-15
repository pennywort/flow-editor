import React, { useCallback, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
} from '@xyflow/react';
import "@xyflow/react/dist/style.css";

import { ButtonNodeModel, ButtonNodeData } from "../../models/ButtonNodeModel";
import { NodeButton } from "../../models/BaseNodeModel";
import { ButtonNode } from "../nodes/ButtonNode/ButtonNode";
import NodeEditor from "../NodeEditor/NodeEditor";

// Фабрика nodeTypes вне компонента
export const nodeTypes = {
    textWithButtons: ButtonNode,
};

const STORAGE_KEY = "flow_nodes_v1";

// Автоматическая инициализация label для всех блоков (особенно если грузим старые данные)
function getInitialNodes(): Node<ButtonNodeData>[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const nodes: Node<ButtonNodeData>[] = JSON.parse(raw);
            // Находим для каждого id label по кнопкам-родителям
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
    // дефолтные
    return [
        new ButtonNodeModel(
            '1',
            'Приветственное сообщение',
            { x: 50, y: 50 },
            `Ответ на ваш вопрос представлен на [Confluence](https://confluence.example.com)`,
            [
                { label: 'Действие 1', target: '2' },
                { label: 'Действие 2', target: '3' },
                { label: 'Внешняя ссылка', external: true, href: 'https://yandex.ru' },
            ]
        ),
        new ButtonNodeModel('2', 'Действие 1', { x: 500, y: 30 }, `**Ответ по действию 1**`),
        new ButtonNodeModel('3', 'Действие 2', { x: 500, y: 150 }, `**Ответ по действию 2**`),
    ];
}

function saveNodesToStorage(nodes: Node<ButtonNodeData>[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}

function getEdgesFromNodes(nodes: Node<ButtonNodeData>[]): Edge[] {
    return nodes.flatMap((node) => {
        const btns = (node.data as ButtonNodeData).buttons ?? [];
        return btns.map((b: NodeButton, idx: number) => {
            if (!b.target) return null;
            return {
                id: `e-${node.id}-btn-${idx}`,
                source: node.id,
                target: b.target!,
                sourceHandle: `btn-${idx}`,
                targetHandle: null,
                type: 'smoothstep',
                animated: false,
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

export default function FlowEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<ButtonNodeData>>(getInitialNodes());
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(getEdgesFromNodes(getInitialNodes()));
    const [editNodeId, setEditNodeId] = useState<string | null>(null);

    React.useEffect(() => {
        setEdges(getEdgesFromNodes(nodes));
        // eslint-disable-next-line
    }, [nodes]);

    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => {
            const filteredNodes = nds.filter((n) => n.id !== nodeId);
            return filteredNodes.map((n) => {
                const oldButtons = (n.data as ButtonNodeData).buttons ?? [];
                const buttons = oldButtons.filter((btn: NodeButton) => btn.target !== nodeId);
                return {
                    ...n,
                    data: {
                        ...n.data,
                        buttons,
                    }
                };
            });
        });
        setEditNodeId((id) => (id === nodeId ? null : id));
    }, [setNodes]);

    const handleEditNode = useCallback((nodeId: string) => {
        setEditNodeId(nodeId);
    }, []);

    const handleSaveEdit = (
        nodeId: string,
        data: ButtonNodeData,
        newActions?: { idx: number, id: string, label: string }[]
    ) => {
        setNodes((nds) => {
            // 1. Обновляем редактируемый блок (текст, кнопки)
            let newNodes = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
            );
            // 2. Для каждой кнопки с target — обновляем label у целевого блока
            (data.buttons ?? []).forEach(btn => {
                if (btn.target) {
                    newNodes = newNodes.map(n =>
                        n.id === btn.target
                            ? { ...n, data: { ...n.data, label: btn.label } }
                            : n
                    );
                }
            });
            // 3. Для новых действий — создаём новые блоки с нужным label
            if (newActions && newActions.length) {
                const parentNode = newNodes.find(n => n.id === nodeId);
                let count = 0;
                const created = newActions.map(({ id, label }) => {
                    const pos = parentNode
                        ? { x: parentNode.position.x + 260, y: parentNode.position.y + 120 + count * 60 }
                        : { x: 100, y: 100 + count * 60 };
                    count++;
                    return new ButtonNodeModel(id, label, pos, "", []);
                });
                newNodes = newNodes.concat(created);
            }
            return newNodes;
        });
        setEditNodeId(null);
    };

    const editingNode = editNodeId
        ? nodes.find((n) => n.id === editNodeId) ?? null
        : null;

    return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'rgb(30, 30, 30)', position: 'relative' }}>
            {/* Временная кнопка Сохранить */}
            <button
                style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    padding: '6px 14px',
                    borderRadius: 6,
                    background: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0002'
                }}
                onClick={() => saveNodesToStorage(nodes)}
            >
                Сохранить
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                colorMode={'dark'}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                connectOnClick={false}
                elementsSelectable={false}
                nodesDraggable={true}
                nodesConnectable={false}
            >
                <Background />
                <Controls />
                <MiniMap
                    pannable={true}
                    style={{ backgroundColor: 'rgb(54,54,54)' }}
                    maskColor={'rgb(54,54,54)'}
                    bgColor={'rgb(54,54,54)'}
                    nodeBorderRadius={16}
                    maskStrokeColor={'#007BFF'}
                    maskStrokeWidth={2}
                />
            </ReactFlow>
            {editingNode && (
                <NodeEditor
                    node={editingNode}
                    onClose={() => setEditNodeId(null)}
                    onSave={(data, newActions) => handleSaveEdit(editingNode.id, data, newActions)}
                />
            )}
        </div>
    );
}
