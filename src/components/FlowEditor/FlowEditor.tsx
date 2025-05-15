import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    MarkerType,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import {ButtonNodeModel} from "../../models/ButtonNodeModel";
import {ButtonNode} from "../nodes/ButtonNode/ButtonNode";

const initialNodes = [
    new ButtonNodeModel(
        '1',
        'Приветственное сообщение',
        { x: 50, y: 50 },
        `Ответ на ваш вопрос представлен на [Confluence](https://confluence.example.com)`,
        [
            { label: 'Действие 1', target: '2' },
            { label: 'Действие 2', target: '3' },
            { label: '🌐 Внешняя ссылка', target: undefined, external: true, href: 'https://yandex.ru' },
        ]
    ),
    new ButtonNodeModel('2', 'Действие 1', { x: 500, y: 30 }, `**Ответ по действию 1**`),
    new ButtonNodeModel('3', 'Действие 2', { x: 500, y: 150 }, `**Ответ по действию 2**`),
];

const initialEdges = initialNodes.flatMap((node) => {
    if (!node.data.buttons) return [];
    return node.data.buttons
        .filter((b) => b.target)
        .map((b, idx) => ({
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
}));
});

const nodeTypes = {
    textWithButtons: ButtonNode,
};

export default function FlowEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'rgb(30, 30, 30)' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
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
        </div>
    );
}
