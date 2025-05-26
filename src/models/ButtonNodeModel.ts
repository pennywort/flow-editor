import { BaseNodeModel, BaseNodeData, NodeButton } from './BaseNodeModel';

export type ButtonNodeData = {
    label: string;
    richText: string;
    buttons?: NodeButton[];
    expanded?: boolean | undefined;
} & BaseNodeData;

export class ButtonNodeModel extends BaseNodeModel<ButtonNodeData> {
	constructor(
		id: string,
		label: string,
		position: { x: number; y: number },
		content: string,
		buttons: NodeButton[] = [],
		extra?: Partial<Omit<ButtonNodeData, 'label' | 'richText' | 'buttons'>>
	) {
		super({
			id,
			type: 'textWithButtons',
			position,
			data: { label, richText: content, buttons, ...(extra || {}) },
		});
	}
}