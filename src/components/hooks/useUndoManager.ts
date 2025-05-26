import { useCallback, useRef } from 'react';
import { Node } from '@xyflow/react';

import { ButtonNodeData } from '../../models/ButtonNodeModel';

export function useUndoManager(initial: Node<ButtonNodeData>[]) {
	const undoStack = useRef<Node<ButtonNodeData>[][]>([]);
	const redoStack = useRef<Node<ButtonNodeData>[][]>([]);
	const lastNodes = useRef<Node<ButtonNodeData>[]>(initial);
	
	const withUndo = useCallback(
		(
			updater: (prev: Node<ButtonNodeData>[]) => Node<ButtonNodeData>[],
			setNodes: (nodes: Node<ButtonNodeData>[]) => void,
			nodes: Node<ButtonNodeData>[]
		) => {
			undoStack.current.push(nodes.map(n => ({ ...n, data: { ...n.data } })));
			redoStack.current.length = 0;
			const updated = updater(nodes);
			lastNodes.current = updated;
			setNodes(updated);
		},
		[]
	);
	
	const undo = useCallback((setNodes: (nodes: Node<ButtonNodeData>[]) => void) => {
		if (undoStack.current.length) {
			redoStack.current.push(lastNodes.current.map(n => ({ ...n, data: { ...n.data } })));
			const prev = undoStack.current.pop();
			if (prev) {
				lastNodes.current = prev;
				setNodes(prev);
			}
		}
	}, []);
	
	const redo = useCallback((setNodes: (nodes: Node<ButtonNodeData>[]) => void) => {
		if (redoStack.current.length) {
			undoStack.current.push(lastNodes.current.map(n => ({ ...n, data: { ...n.data } })));
			const next = redoStack.current.pop();
			if (next) {
				lastNodes.current = next;
				setNodes(next);
			}
		}
	}, []);
	
	const canUndo = () => undoStack.current.length > 0;
	const canRedo = () => redoStack.current.length > 0;
	
	return { withUndo, undo, redo, canUndo, canRedo };
}
