import React, {memo} from "react";
import {
    panelContainer,
    saveButton,
    autoLayoutButton,
    uploadButton,
} from "./styles";
import { Node } from "@xyflow/react";
import { ButtonNodeData } from "../../models/ButtonNodeModel";
import { yamlToNodes } from "../../utils/yamlToNodes";

type Props = {
    onSave: () => void;
    onAutoLayout: () => void;
    onOpenFileDialog: () => void;
    onCollapseAll: (expanded: boolean) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onNodesLoaded: (nodes: Node<ButtonNodeData>[]) => void;
};

const EditorControlsPanel: React.FC<Props> = ({
                                                  onSave,
                                                  onAutoLayout,
                                                  onOpenFileDialog,
                                                  onCollapseAll,
                                                  fileInputRef,
                                                  onNodesLoaded,
                                              }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
            <button style={saveButton} onClick={onSave}>Сохранить</button>
            <button style={autoLayoutButton} onClick={onAutoLayout}>Автораспределить</button>
            <button style={uploadButton} onClick={onOpenFileDialog}>Загрузить YAML</button>
            <button style={autoLayoutButton} onClick={() => onCollapseAll(false)}>Свернуть</button>
            <button style={autoLayoutButton} onClick={() => onCollapseAll(true)}>Развернуть</button>
            <input
                type="file"
                accept=".yaml,.yml"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default memo(EditorControlsPanel);