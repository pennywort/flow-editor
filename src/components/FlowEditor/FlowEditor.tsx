import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
	ReactFlow,
	Background,
	MiniMap,
	useNodesState,
	Node,
	Edge,
	useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { ButtonNodeModel, ButtonNodeData } from '../../models/ButtonNodeModel';
import { NodeButton } from '../../models/BaseNodeModel';
import NodeEditor from '../NodeEditor/NodeEditor';
import { getLayoutedElements } from '../../utils/autoLayout';
import ButtonNode from '../nodes/ButtonNode/ButtonNode';
import { useHotkeys } from '../hooks/useHotKeys';
import { useSearch } from '../../context/SearchContext';
import EditorControlsPanel from '../EditorControlsPanel/EditorControlsPanel';
import SearchPanel from '../SearchPanel/SearchPanel';
import { nodesToYaml } from '../../utils/nodesToYaml';
import { removeOrphanNodes } from '../../utils/removeOrphanNodes';
import UndoRedoPanel from '../UndoRedoPanel/UndoRedoPanel';
import { useUndoManager } from '../hooks/useUndoManager';

import { getEdgesFromNodes, getInitialNodes, saveNodesToStorage } from './utils';
import { rootContainer, searchPanelContainer } from './styles';
import { FlowControls } from './FlowControls';

export default function FlowEditor() {
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<ButtonNodeData>>(getInitialNodes());
	const [editNodeId, setEditNodeId] = useState<string | null>(null);
	const [allExpanded, setAllExpanded] = useState<boolean>(false);
	const [edgeType] = useState<string>('simplebezier');
	const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
	const [currentDirection, setCurrentDirection] = useState<'target' | 'source' | null>('target');
	const [foundNodeIds, setFoundNodeIds] = useState<string[]>([]);
	const [foundIndex, setFoundIndex] = useState<number>(0);
	const { search } = useSearch();

	const undoManager = useUndoManager(nodes);

	useHotkeys([
		{
			keys: 'ctrl+f|meta+f|command+f',
			callback: () => searchInputRef.current?.focus(),
			preventDefault: true,
		},
		{
			keys: 'ctrl+z|meta+z|command+z',
			callback: () => undoManager.undo(setNodes),
			preventDefault: true,
		},
		{
			keys: 'ctrl+shift+z|meta+shift+z|command+shift+z',
			callback: () => undoManager.redo(setNodes),
			preventDefault: true,
		},
	]);

	useEffect(() => {
		if (!search) {
			setFoundNodeIds([]);
			setFoundIndex(0);
			return;
		}
		const lower = search.toLowerCase();
		const ids = nodes
			.filter(n =>
				(n.data.label && n.data.label.toLowerCase().includes(lower)) ||
                ('richText' in n.data && (n.data.richText as string).toLowerCase().includes(lower))
			)
			.map(n => n.id);
		setFoundNodeIds(ids);
		setFoundIndex(0);
	}, [search, nodes]);

	const reactFlowInstance = useReactFlow();

	const edges = useMemo(() => getEdgesFromNodes(nodes, edgeType).map(edge => ({
		...edge,
		animated: selectedEdgeId === edge.id,
		style: selectedEdgeId === edge.id
			? { ...edge.style }
			: edge.style,
	})), [nodes, edgeType, selectedEdgeId]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleEditNode = useCallback((nodeId: string) => {
		setEditNodeId(nodeId);
	}, []);

	const handleDeleteNode = useCallback((nodeId: string) => {
		undoManager.withUndo((nds) => {
			let filteredNodes = nds.filter((n) => n.id !== nodeId);
			filteredNodes = filteredNodes.map((n) => {
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
			return removeOrphanNodes(filteredNodes, 'menu');
		}, setNodes, nodes);
		setEditNodeId((id) => (id === nodeId ? null : id));
	}, [undoManager, setNodes, nodes]);

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
			return <ButtonNode {...props}
				onCollapse={handleCollapseNode}
				onDelete={handleDeleteNode}
				onEdit={handleEditNode}/>;
		},
	}), [handleCollapseNode, handleDeleteNode, handleEditNode]);

	const handleOpenFileDialog = () => {
		fileInputRef.current?.click();
	};

	const handleAutoLayout = () => {
		undoManager.withUndo(
			nodes => getLayoutedElements(nodes, edges, 'LR'),
			setNodes, nodes
		);
		saveNodesToStorage(nodes);
	};

	const handleSave = () => {
		saveNodesToStorage(nodes);
	};

	const handleSaveYaml = () => {
		console.log(nodesToYaml(nodes));
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
		setAllExpanded(expanded);
	};

	const handleSaveEdit = (
		nodeId: string,
		data: ButtonNodeData,
		newActions?: { idx: number, id: string, label: string }[]
	) => {
		undoManager.withUndo((nds) => {
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
					return new ButtonNodeModel(id, label, pos, '', []);
				});
				newNodes = newNodes.concat(created);
			}

			newNodes = removeOrphanNodes(newNodes);

			return newNodes;
		}, setNodes, nodes);
		setEditNodeId(null);
	};

	const handleEdgeClick = useCallback(
		(event: React.MouseEvent, edge: Edge) => {
			event.stopPropagation();
			let nextDirection: 'target' | 'source' = 'target';

			if (selectedEdgeId === edge.id) {
				nextDirection = currentDirection === 'target' ? 'source' : 'target';
			}

			setSelectedEdgeId(edge.id);
			setCurrentDirection(nextDirection);

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

	const handleNodesLoaded = useCallback((newNodes: Node<ButtonNodeData>[]) => {
		setNodes(newNodes);
		saveNodesToStorage(newNodes);
	}, []);

	const handlePaneClick = useCallback(() => {
		setSelectedEdgeId(null);
		setCurrentDirection(null);
	}, []);

	const editingNode = editNodeId
		? nodes.find((n) => n.id === editNodeId) ?? null
		: null;

	return (
		<div style={rootContainer}>
			<EditorControlsPanel
				onSave={handleSave}
				onSaveToYaml={handleSaveYaml}
				onAutoLayout={handleAutoLayout}
				onOpenFileDialog={handleOpenFileDialog}
				fileInputRef={fileInputRef}
				onNodesLoaded={handleNodesLoaded}
			/>
			<div style={searchPanelContainer}>
				<SearchPanel
					inputRef={searchInputRef}
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
				<FlowControls
					onToggleCollapse={() => handleCollapseAll(!allExpanded)}
					collapsed={allExpanded}
				/>
				<MiniMap
					pannable={true}
					zoomable={true}
					nodeColor={'rgba(35,141,255,0.7)'}
					nodeBorderRadius={16}
					maskStrokeColor={'#007BFF'}
					maskStrokeWidth={2}
				/>
			</ReactFlow>
			<UndoRedoPanel
				onUndo={() => undoManager.undo(setNodes)}
				onRedo={() => undoManager.redo(setNodes)}
				canUndo={undoManager.canUndo()}
				canRedo={undoManager.canRedo()}
			/>
			{editingNode && (
				<NodeEditor
					node={editingNode}
					onClose={() => setEditNodeId(null)}
					onDeleteNode={handleDeleteNode}
					onSave={(data: any, newActions: any) => handleSaveEdit(editingNode.id, data, newActions)}
				/>
			)}
		</div>
	);
}
