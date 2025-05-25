import yaml from 'yaml';
import { Node } from '@xyflow/react';
import { ButtonNodeModel, ButtonNodeData } from '../models/ButtonNodeModel';
import { NodeButton } from '../models/BaseNodeModel';

export function yamlToNodes(yamlString: string): Node<ButtonNodeData>[] {
    const obj = yaml.parse(yamlString);

    const nodes: Node<ButtonNodeData>[] = [];
    const messageMap = new Map<string, any>();
    (obj.messages ?? []).forEach((msg: any) => messageMap.set(msg.id, msg));

    // Для быстрого поиска всех link- и action-кнопок по parent_message
    const buttonsByParent = new Map<string, NodeButton[]>();
    (obj.messages ?? []).forEach((msg: any) => {
        if (!msg.parent_message) return;
        if (!buttonsByParent.has(msg.parent_message)) {
            buttonsByParent.set(msg.parent_message, []);
        }
        if (msg.is_link_button) {
            // Кнопка-ссылка
            buttonsByParent.get(msg.parent_message)!.push({
                id: msg.id,
                label: msg.label,
                external: true,
            });
        }
    });

    // Для root блока
    function collectButtons(childMessages: string[] | undefined, parentId: string): NodeButton[] {
        const result: NodeButton[] = [];
        if (!childMessages) return result;

        for (const childId of childMessages) {
            const child = messageMap.get(childId);
            if (!child) continue;
            if (child.is_link_button) {
                // такие кнопки не должны попадать сюда (они через parent_message)
                continue;
            } else {
                result.push({
                    id: child.id,
                    label: child.label,
                    target: child.id,
                });
            }
        }
        // добавляем все внешние кнопки-ссылки для этого блока (если есть)
        if (buttonsByParent.has(parentId)) {
            result.push(...buttonsByParent.get(parentId)!);
        }
        return result;
    }

    // Root node
    nodes.push(
        new ButtonNodeModel(
            obj.id,
            '', // label может быть пустым у root
            { x: 50, y: 50 },
            obj.text,
            collectButtons(obj.child_messages, obj.id),
            {
                parent_message: undefined,
                back_label: obj.back_label,
                back_to_start_message_label: obj.back_to_start_message_label,
                delete_id: obj.delete_id,
                delete_label: obj.delete_label,
            }
        )
    );

    // Все остальные nodes (исключая ссылки)
    (obj.messages ?? []).forEach((msg: any, i: number) => {
        if (msg.is_link_button) return; // external-кнопки не nodes!
        nodes.push(
            new ButtonNodeModel(
                msg.id,
                msg.label,
                { x: 300 + i * 40, y: 50 + i * 100 },
                msg.text ?? "",
                collectButtons(msg.child_messages, msg.id),
                {
                    parent_message: msg.parent_message,
                    back_label: msg.back_label,
                    back_to_start_message_label: msg.back_to_start_message_label,
                    delete_id: msg.delete_id,
                    delete_label: msg.delete_label,
                }
            )
        );
    });

    return nodes;
}
