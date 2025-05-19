import yaml from 'yaml';
import { Node } from '@xyflow/react';
import { ButtonNodeModel, ButtonNodeData } from '../models/ButtonNodeModel';
import { NodeButton } from '../models/BaseNodeModel';

export function yamlToNodes(yamlString: string): Node<ButtonNodeData>[] {
    const obj = yaml.parse(yamlString);

    const nodes: Node<ButtonNodeData>[] = [];
    const messageMap = new Map<string, any>();
    (obj.messages ?? []).forEach((msg: any) => messageMap.set(msg.id, msg));

    function collectButtons(childMessages: string[] | undefined): NodeButton[] {
        if (!childMessages) return [];
        const result: NodeButton[] = [];
        for (const childId of childMessages) {
            const child = messageMap.get(childId);
            if (!child) continue;
            // кнопка-ссылка (is_link_button) не соединяется ни с чем, target не нужен
            if (child.is_link_button) {
                result.push({ label: child.label, external: true });
            } else {
                result.push({ label: child.label, target: childId });
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
            collectButtons(obj.child_messages)
        )
    );

    (obj.messages ?? []).forEach((msg: any, i: number) => {
        if (msg.is_link_button) return;
        nodes.push(
            new ButtonNodeModel(
                msg.id,
                msg.label,
                { x: 300 + i * 40, y: 50 + i * 100 },
                msg.text,
                collectButtons(msg.child_messages)
            )
        );
    });

    return nodes;
}
