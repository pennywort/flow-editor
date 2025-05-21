import yaml from 'yaml';
import { Node } from '@xyflow/react';
import { ButtonNodeData } from '../models/ButtonNodeModel';

interface YamlButton {
    label: string;
    is_link_button?: boolean;
    parent_message?: string;
}

interface YamlMessage {
    id: string;
    label: string;
    text: string;
    child_messages?: string[];
    parent_message?: string;
    is_link_button?: boolean;
}

interface YamlRoot {
    id: string;
    text: string;
    back_label?: string;
    delete_id?: string;
    delete_label?: string;
    child_messages: string[];
    messages: YamlMessage[];
}

export function nodesToYaml(nodes: Node<ButtonNodeData>[], rootId: string = 'menu'): string {
    const messages: YamlMessage[] = [];

    let rootChildMessages: string[] = [];

    const rootNode = nodes.find(n => n.id === rootId);
    if (!rootNode) throw new Error('Root node not found!');

    rootChildMessages = (rootNode.data.buttons ?? [])
        .filter(btn => !btn.external && btn.target)
        .map(btn => btn.target!);

    nodes.forEach((node) => {
        if (node.id === rootId) return;
        const buttons = node.data.buttons ?? [];

        const childMessages = buttons
            .filter(btn => !btn.external && btn.target)
            .map(btn => btn.target!);

        const linkButtons: YamlMessage[] = buttons
            .filter(btn => btn.external)
            .map((btn) => ({
                id: '',
                label: btn.label,
                text: '',
                parent_message: node.id,
                is_link_button: true,
            }));

        messages.push({
            id: node.id,
            label: node.data.label,
            text: node.data.richText,
            child_messages: childMessages.length > 0 ? childMessages : undefined,
            parent_message: (node.data as any).parent_message, // если нужно
        });

        messages.push(...linkButtons);
    });

    const yamlObj: YamlRoot = {
        id: rootId,
        text: rootNode.data.richText,
        back_label: 'Назад', //TODO
        delete_id: `delete_${rootId}`,
        delete_label: 'Отмена',
        child_messages: rootChildMessages,
        messages,
    };

    return yaml.stringify(yamlObj);
}
