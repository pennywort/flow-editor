import { Node } from "@xyflow/react";
import {ButtonNodeData} from "../models/ButtonNodeModel";

export function removeNodesRecursively(
    nodes: Node<ButtonNodeData>[],
    targetId: string
): Node<ButtonNodeData>[] {
    // 1. Удалить сам блок
    let newNodes = nodes.filter(n => n.id !== targetId);

    // 2. Удалить все кнопки, ведущие к этому id
    newNodes = newNodes.map(n => ({
        ...n,
        data: {
            ...n.data,
            buttons: (n.data.buttons ?? []).filter(btn => btn.target !== targetId)
        }
    }));

    // 3. Рекурсивно удалить все потомки этого блока
    // (если у блока есть кнопки-children)
    const removedNode = nodes.find(n => n.id === targetId);
    if (removedNode && removedNode.data.buttons) {
        for (const btn of removedNode.data.buttons) {
            if (btn.target) {
                newNodes = removeNodesRecursively(newNodes, btn.target);
            }
        }
    }

    return newNodes;
}
