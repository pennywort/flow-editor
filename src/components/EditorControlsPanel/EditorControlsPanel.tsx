import React, { memo } from 'react';
import { Node } from '@xyflow/react';

import { ButtonNodeData } from '../../models/ButtonNodeModel';
import { yamlToNodes } from '../../utils/yamlToNodes';
import { Button } from '../shared';

import {
	panelContainer,
} from './styles';

type Props = {
    onSave: () => void;
    onSaveToYaml?: () => void;
    onAutoLayout: () => void;
    onOpenFileDialog: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onNodesLoaded: (nodes: Node<ButtonNodeData>[]) => void;
};

const EditorControlsPanel: React.FC<Props> = ({
	onSave,
	onSaveToYaml,
	onAutoLayout,
	onOpenFileDialog,
	fileInputRef,
	onNodesLoaded,
}) => {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const yamlText = ev.target?.result as string;
				const newNodes = yamlToNodes(yamlText);
				onNodesLoaded(newNodes);
			} catch (err) {
				alert('Ошибка разбора YAML');
			}
		};
		reader.readAsText(file);
		e.target.value = '';
	};

	return (
		<div style={panelContainer}>
			<Button
				size="medium"
				variant="contained"
				color="#007BFF"
				onClick={onSave}
			>
                Сохранить
			</Button>
			<Button
				size="medium"
				variant="contained"
				color="#1CB65D"
				onClick={onAutoLayout}
			>
                Распределить
			</Button>
			{/* @ts-expect-error: for debugging */}
			{window.debugChatBotEditor && <Button
				size="medium"
				variant="contained"
				color="#9147FF"
				onClick={onOpenFileDialog}
			>
				Загрузить YAML
			</Button>}
			{/* @ts-expect-error: for debugging */}
			{window.debugChatBotEditor && <Button
				size="medium"
				variant="contained"
				color="#8E8DCC"
				onClick={onSaveToYaml}
			>
				Выгрузить YAML
			</Button>}
			<input
				type="file"
				accept=".yaml,.yml"
				style={{ display: 'none' }}
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
		</div>

	);
};

export default memo(EditorControlsPanel);