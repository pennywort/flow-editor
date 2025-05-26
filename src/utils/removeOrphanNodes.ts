import {ButtonNodeData} from "../models/ButtonNodeModel";
import {Node} from "@xyflow/react";

/**
 * Удаляет все висячие ноды, кроме root (у которых нет ни одной входящей кнопки).
 * rootId — это id корневой ноды (обычно 'menu').
 */
export function removeOrphanNodes(nodes: Node<ButtonNodeData>[], rootId: string = 'menu'): Node<ButtonNodeData>[] {
    let lastCount = -1;
    let currentNodes = nodes;
    // Повторяем пока количество нод меняется
    while (lastCount !== currentNodes.length) {
        lastCount = currentNodes.length;
        // Собираем все id, на которые есть хоть одна кнопка
        const referencedIds = new Set<string>([rootId]);
        currentNodes.forEach(node => {
            (node.data.buttons ?? []).forEach(btn => {
                if (btn.target) {
                    referencedIds.add(btn.target);
                }
            });
        });
        // Фильтруем только связанные и root
        currentNodes = currentNodes.filter(node => referencedIds.has(node.id));
    }
    return currentNodes;
}
