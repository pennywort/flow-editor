import { BaseNodeModel, BaseNodeData, NodeButton } from './BaseNodeModel';

export type ButtonNodeData = {
    richText: string;
    buttons?: NodeButton[];
} & BaseNodeData;

export class ButtonNodeModel extends BaseNodeModel<ButtonNodeData> {
    constructor(
        id: string,
        label: string,
        position: { x: number; y: number },
        content: string,
        buttons: NodeButton[] = []
    ) {
        super({
            id,
            type: 'textWithButtons',
            position,
            data: { label, richText: content, buttons },
        });
    }
}