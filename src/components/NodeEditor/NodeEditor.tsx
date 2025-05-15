import React, { useState } from "react";
import { Node } from "@xyflow/react";
import { ButtonNodeData } from "../../models/ButtonNodeModel";
import { NodeButton } from "../../models/BaseNodeModel";

type Props = {
    node: Node<ButtonNodeData>;
    onSave: (data: ButtonNodeData, newActions?: { idx: number, id: string, label: string }[]) => void;
    onClose: () => void;
};

export default function NodeEditor({ node, onSave, onClose }: Props) {
    const [richText, setRichText] = useState(node.data.richText);
    const [buttons, setButtons] = useState<NodeButton[]>([...(node.data.buttons ?? [])]);

    const handleButtonChange = (idx: number, field: keyof NodeButton, value: any) => {
        setButtons((prev) =>
            prev.map((b, i) =>
                i === idx ? { ...b, [field]: value } : b
            )
        );
    };

    const handleDeleteButton = (idx: number) => {
        setButtons((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleAddButton = () => {
        setButtons((prev) => [...prev, { label: "Новое действие" }]);
    };

    const handleAddLinkButton = () => {
        setButtons((prev) => [...prev, { label: "Новая ссылка", external: true, href: "" }]);
    };

    const handleSave = () => {
        const newActions: { idx: number, id: string, label: string }[] = [];
        const updatedButtons = buttons.map((btn, idx) => {
            if (!btn.external && !btn.target) {
                // новая обычная кнопка без target — создаём id
                const id = crypto.randomUUID();
                newActions.push({ idx, id, label: btn.label });
                return { ...btn, target: id };
            }
            return btn;
        });
        onSave({ ...node.data, richText, buttons: updatedButtons }, newActions.length ? newActions : undefined);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: 350,
                height: "100vh",
                background: "#232323",
                color: "#fff",
                zIndex: 99,
                boxShadow: "-2px 0 8px #0007",
                padding: 24,
                overflowY: "auto",
            }}
        >
            <button style={{ float: "right" }} onClick={onClose}>
                ✖
            </button>
            <h3>Редактировать блок</h3>
            <div style={{ marginBottom: 10 }}>
                <label>Текст (Markdown):</label>
                <textarea
                    value={richText}
                    onChange={(e) => setRichText(e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: 80,
                        marginTop: 6,
                        marginBottom: 6,
                        resize: "vertical",
                        color: "#fff",
                        background: "#222",
                        border: "1px solid #444",
                        borderRadius: 6,
                        padding: 8,
                    }}
                />
            </div>
            <div>
                <b>Кнопки:</b>
                {buttons.map((btn, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 8,
                            background: "#353535",
                            borderRadius: 8,
                            padding: 6,
                        }}
                    >
                        <input
                            value={btn.label}
                            onChange={(e) => handleButtonChange(i, "label", e.target.value)}
                            style={{ flex: 1, padding: 4, borderRadius: 4, border: "1px solid #666" }}
                            placeholder={btn.external ? "Текст ссылки" : "Текст кнопки"}
                        />
                        {btn.external ? (
                            <input
                                value={btn.href ?? ""}
                                onChange={(e) => handleButtonChange(i, "href", e.target.value)}
                                style={{ flex: 2, padding: 4, borderRadius: 4, border: "1px solid #666" }}
                                placeholder="URL"
                            />
                        ) : null}
                        <button onClick={() => handleDeleteButton(i)} style={{ color: "red" }}>
                            ✖
                        </button>
                    </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={handleAddButton}>+ Добавить действие</button>
                    <button onClick={handleAddLinkButton}>+ Добавить ссылку</button>
                </div>
            </div>
            <div style={{ marginTop: 16 }}>
                <button
                    onClick={handleSave}
                    style={{
                        fontWeight: "bold",
                        background: "#007BFF",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 6,
                        marginTop: 12,
                    }}
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
}
