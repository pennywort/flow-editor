import yaml from 'yaml';
import { Node } from '@xyflow/react';

import { NodeButton } from '../models/BaseNodeModel';
import { ButtonNodeData } from '../models/ButtonNodeModel';

interface YamlMessage {
    id: string;
    label: string;
    text?: string;
    child_messages?: string[];
    parent_message?: string;
    is_link_button?: boolean;
    back_label?: string;
    back_to_start_message_label?: string;
    delete_id?: string;
    delete_label?: string;
}

interface YamlRoot {
    id: string;
    text: string;
    back_label?: string;
    back_to_start_message_label?: string;
    delete_id?: string;
    delete_label?: string;
    child_messages: string[];
    messages: YamlMessage[];
}

export function nodesToYaml(nodes: Node<ButtonNodeData>[], rootId = 'menu'): string {
	const rootNode = nodes.find(n => n.id === rootId) || nodes[0];
	if (!rootNode) {
		throw new Error('Root node not found!');
	}

	// Сериализация кнопок
	function splitButtons(buttons: NodeButton[], parentId: string) {
		const child_message_ids: string[] = [];
		const link_buttons: YamlMessage[] = [];
		for (const btn of buttons) {
			if (btn.external) {
				link_buttons.push({
					id: btn.id,
					label: btn.label,
					parent_message: parentId,
					is_link_button: true
				});
			} else if (btn.target) {
				child_message_ids.push(btn.target);
			}
		}
		return { child_message_ids, link_buttons };
	}

	// --- Сборка YAML ---
	const messages: YamlMessage[] = [];
	let rootChildMessages: string[] = [];
	let linkButtons: YamlMessage[] = [];

	// Сначала root
	if (rootNode.data.buttons) {
		const split = splitButtons(rootNode.data.buttons, rootNode.id);
		rootChildMessages = split.child_message_ids;
		linkButtons = [...split.link_buttons];
	}

	nodes.forEach(node => {
		if (node.id === rootNode.id) {
			return;
		}
		const data = node.data;
		let child_messages: string[] = [];

		if (data.buttons) {
			const split = splitButtons(data.buttons, node.id);
			child_messages = split.child_message_ids;
			linkButtons.push(...split.link_buttons);
		}
		messages.push({
			id: node.id,
			label: data.label,
			text: data.richText,
			child_messages: child_messages.length ? child_messages : undefined,
			parent_message: (data as any).parent_message,
			back_label: (data as any).back_label,
			back_to_start_message_label: (data as any).back_to_start_message_label,
			delete_id: (data as any).delete_id,
			delete_label: (data as any).delete_label,
		});
	});

	// Добавляем все external кнопки в messages!
	messages.push(...linkButtons);

	const yamlObj: YamlRoot = {
		id: rootNode.id,
		text: rootNode.data.richText,
		back_label: (rootNode.data as any).back_label,
		back_to_start_message_label: (rootNode.data as any).back_to_start_message_label,
		delete_id: (rootNode.data as any).delete_id,
		delete_label: (rootNode.data as any).delete_label,
		child_messages: rootChildMessages,
		messages,
	};

	return yaml.stringify(yamlObj);
}
