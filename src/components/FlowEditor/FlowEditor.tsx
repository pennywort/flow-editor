import React, {useCallback, useRef, useState, useMemo, useEffect} from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType,
    useNodesState,
    Node,
    Edge, useReactFlow,
} from '@xyflow/react';
import "@xyflow/react/dist/style.css";

import { ButtonNodeModel, ButtonNodeData } from "../../models/ButtonNodeModel";
import { NodeButton } from "../../models/BaseNodeModel";
import NodeEditor from "../NodeEditor/NodeEditor";
import { yamlToNodes } from "../../utils/yamlToNodes";
import { getLayoutedElements } from "../../utils/autoLayout";
import ButtonNode from "../nodes/ButtonNode/ButtonNode";

import {
    panelContainer,
    saveButton,
    autoLayoutButton,
    uploadButton,
    select as selectStyle,
    rootContainer,
    searchPanelContainer,
} from "./styles";
import {SearchPanel} from "../SearchPanel/SearchPanel";
import {useHotkeys} from "../hooks/useHotKeys";

// export const nodeTypes = {
//     textWithButtons: (props: any) => <ButtonNode {...props} />,
// };

const STORAGE_KEY = "flow_nodes_v1";

function getInitialNodes(): Node<ButtonNodeData>[] {
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

function saveNodesToStorage(nodes: Node<ButtonNodeData>[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}

function getEdgesFromNodes(nodes: Node<ButtonNodeData>[], edgeType: string): Edge[] {
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

const EDGE_TYPE_OPTIONS = [
    { value: "simplebezier", label: "Simple Bezier" },
    { value: "default", label: "Default" },
    { value: "step", label: "Step" },
    { value: "smoothstep", label: "Smooth Step" },
    { value: "straight", label: "Straight" },
];

export default function FlowEditor() {
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node<ButtonNodeData>>(getInitialNodes());
    const [editNodeId, setEditNodeId] = useState<string | null>(null);
    const [edgeType, setEdgeType] = useState<string>("simplebezier");
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [currentDirection, setCurrentDirection] = useState<'target' | 'source' | null>('target');
    const [searchString, setSearchString] = useState<string>('');
    const [foundNodeIds, setFoundNodeIds] = useState<string[]>([]);
    const [foundIndex, setFoundIndex] = useState<number>(0);

    useHotkeys([
        {
            keys: "ctrl+f|meta+f|command+f",
            callback: () => searchInputRef.current?.focus(),
            preventDefault: true,
        },
        {
            keys: "ctrl+z|meta+z|command+z",
            callback: () => null,
            preventDefault: true,
        },
        {
            keys: "ctrl+shift+z|meta+shift+z|command+shift+z",
            callback: () => null,
            preventDefault: true,
        },
    ]);

    useEffect(() => {
        if (!searchString) {
            setFoundNodeIds([]);
            setFoundIndex(0);
            return;
        }
        const lower = searchString.toLowerCase();
        const ids = nodes
            .filter(n =>
                (n.data.label && n.data.label.toLowerCase().includes(lower)) ||
                ('richText' in n.data && (n.data.richText as string).toLowerCase().includes(lower))
            )
            .map(n => n.id);
        setFoundNodeIds(ids);
        setFoundIndex(0);
    }, [searchString, nodes]);

    const reactFlowInstance = useReactFlow();

    const edges = useMemo(() => getEdgesFromNodes(nodes, edgeType).map(edge => ({
        ...edge,
        animated: selectedEdgeId === edge.id,
        style: selectedEdgeId === edge.id
            ? { ...edge.style, strokeWidth: 3 }
            : edge.style,
    })), [nodes, edgeType, selectedEdgeId]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCollapseNode = useCallback((nodeId: string, expanded: boolean) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            expanded: !expanded,
                        },
                    }
                    : node
            )
        );
    }, [setNodes]);

    const nodeTypes = useMemo(() => ({
        textWithButtons: (props: any) => {
            return <ButtonNode {...props} onCollapse={handleCollapseNode}/>
        },
    }), [handleCollapseNode]);

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const yamlText = ev.target?.result as string;
                const newNodes = yamlToNodes(yamlText);
                setNodes(newNodes);
                saveNodesToStorage(newNodes);
            } catch (err) {
                alert('Ошибка разбора YAML');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleAutoLayout = () => {
        const newNodes = getLayoutedElements(nodes, edges, 'LR');
        setNodes(newNodes);
        saveNodesToStorage(newNodes);
    };

    const handleSave = () => {
        saveNodesToStorage(nodes);
    };

    const handleCollapseAll = (expanded: boolean) => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    expanded: expanded,
                }
            }))
        );
    };

    const handleEdgeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEdgeType(e.target.value);
    };

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
            let newNodes = nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
            );

            (data.buttons ?? []).forEach(btn => {
                if (btn.target) {
                    newNodes = newNodes.map(n =>
                        n.id === btn.target
                            ? { ...n, data: { ...n.data, label: btn.label } }
                            : n
                    );
                }
            });

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

    const handleEdgeClick = useCallback(
        (event: React.MouseEvent, edge: Edge) => {
            event.stopPropagation();
            console.log(edge)
            let nextDirection: 'target' | 'source' = 'target';

            if (selectedEdgeId === edge.id) {
                nextDirection = currentDirection === 'target' ? 'source' : 'target';
            }

            setSelectedEdgeId(edge.id);
            setCurrentDirection(nextDirection);

            // Куда перемещать viewport
            const nodeId = nextDirection === 'target' ? edge.target : edge.source;
            const node = nodes.find(n => n.id === nodeId);

            if (node && reactFlowInstance) {
                reactFlowInstance.setCenter(
                    node.position.x + 180,
                    node.position.y + 100,
                    { zoom: 1.2, duration: 800 }
                );
            }
        },
        [selectedEdgeId, currentDirection, nodes, reactFlowInstance]
    );

    const handlePaneClick = useCallback(() => {
        setSelectedEdgeId(null);
        setCurrentDirection(null);
    }, [])

    const editingNode = editNodeId
        ? nodes.find((n) => n.id === editNodeId) ?? null
        : null;

    return (
        <div style={rootContainer}>
            <div style={panelContainer}>
                <button style={saveButton} onClick={handleSave}>Сохранить</button>
                <button style={autoLayoutButton} onClick={handleAutoLayout}>Автораспределить</button>
                <button style={uploadButton} onClick={handleOpenFileDialog}>Загрузить YAML</button>
                <button style={autoLayoutButton} onClick={() => handleCollapseAll(false)}>Свернуть</button>
                <button style={autoLayoutButton} onClick={() => handleCollapseAll(true)}>Развернуть</button>
                <input
                    type="file"
                    accept=".yaml,.yml"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <select style={selectStyle} value={edgeType} onChange={handleEdgeTypeChange}>
                    {EDGE_TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div
                style={searchPanelContainer}
            >
                <SearchPanel
                    inputRef={searchInputRef}
                    searchString={searchString}
                    setSearchString={setSearchString}
                    foundNodeIds={foundNodeIds}
                    foundIndex={foundIndex}
                    setFoundIndex={setFoundIndex}
                    nodes={nodes}
                    reactFlowInstance={reactFlowInstance}
                />
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                colorMode={'dark'}
                nodeTypes={nodeTypes}
                fitView
                connectOnClick={false}
                elementsSelectable={false}
                nodesDraggable={true}
                nodesConnectable={false}
                onNodesChange={onNodesChange}
                onPaneClick={handlePaneClick}
                onEdgeClick={handleEdgeClick}
            >
                <Background />
                <Controls />
                <MiniMap
                    pannable={true}
                    zoomable={true}
                    nodeColor={'rgba(35,141,255,0.7)'}
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
