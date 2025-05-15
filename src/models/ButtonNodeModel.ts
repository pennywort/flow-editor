import { BaseNodeModel, BaseNodeData, NodeButton } from './BaseNodeModel';

export class ButtonNodeModel extends BaseNodeModel {
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