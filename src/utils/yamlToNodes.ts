import yaml from 'yaml';
import { Node } from '@xyflow/react';
import { ButtonNodeModel, ButtonNodeData } from '../models/ButtonNodeModel';
import { NodeButton } from '../models/BaseNodeModel';

export function yamlToNodes(yamlString: string): Node<ButtonNodeData>[] {
    const obj = yaml.parse(yamlString);

    const nodes: Node<ButtonNodeData>[] = [];
    const messageMap = new Map<string, any>();
    const linkButtons: any[] = [];

    // Разделим обычные сообщения и external link-кнопки
    (obj.messages ?? []).forEach((msg: any) => {
        if (msg.is_link_button) linkButtons.push(msg);
        messageMap.set(msg.id, msg);
    });

    function collectButtons(message: any): NodeButton[] {
        const result: NodeButton[] = [];

        // 1. Обычные дочерние кнопки (по child_messages)
        if (message.child_messages) {
            for (const childId of message.child_messages) {
                const child = messageMap.get(childId);
                if (child && !child.is_link_button) {
                    result.push({ label: child.label, target: childId, id: child.id });
                }
            }
        }

        // 2. External link-кнопки по parent_message
        for (const link of linkButtons) {
            if (link.parent_message === message.id) {
                result.push({
                    label: link.label,
                    external: true,
                    id: link.id,
                });
            }
        }
        return result;
    }

    // Root node
    nodes.push(
        new ButtonNodeModel(
            obj.id,
            '', // label у рутового блока может быть пустым
            { x: 50, y: 50 },
            obj.text,
            collectButtons(obj)
        )
    );

    (obj.messages ?? []).forEach((msg: any, i: number) => {
        if (msg.is_link_button) return; // сами external-кнопки как отдельные блоки не нужны!
        nodes.push(
            new ButtonNodeModel(
                msg.id,
                msg.label,
                { x: 300 + i * 40, y: 50 + i * 100 },
                msg.text,
                collectButtons(msg)
            )
        );
    });

    return nodes;
}
