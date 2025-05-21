import { Node, ReactFlowInstance } from '@xyflow/react';

export function smoothCenterToNode(
    node: Node | undefined,
    reactFlowInstance: ReactFlowInstance | undefined,
    zoom: number = 1.2
): void {
    if (node && reactFlowInstance) {
        reactFlowInstance.setCenter(
            node.position.x + 180,
            node.position.y + 100,
            { zoom, duration: 800 }
        );
    }
}
