import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';

import { Button, SvgIcon } from '../shared';
import { ButtonNodeData } from '../../models/ButtonNodeModel';
import { NodeButton } from '../../models/BaseNodeModel';
import { ReactComponent as DeleteSvg } from '../shared/svg/delete.svg';
import { ReactComponent as CloseSvg } from '../shared/svg/close.svg';
import { ReactComponent as PlusSvg } from '../shared/svg/plus.svg';
import { useDialog } from '../../context/DialogContext';

import { ReactComponent as DragSvg } from './icons/drag.svg';
import * as styles from './styles';
import MarkdownEditor from './MarkdownEditor';

type Props = {
    node: Node<ButtonNodeData>;
    onSave: (data: ButtonNodeData, newActions?: { idx: number, id: string, label: string }[]) => void;
    onClose: () => void;
    onDeleteNode: (nodeId: string) => void;
};

export default function NodeEditor(props: Props) {
	const { onSave, onClose, onDeleteNode, node } = props;
	const [richText, setRichText] = useState(node.data.richText);
	const [buttons, setButtons] = useState<NodeButton[]>([...(node.data.buttons ?? [])]);

	// --- root block fields ---
	const isRoot = node.id === 'menu';
	const [backLabel, setBackLabel] = useState(node.data.back_label ?? '');
	const [backToStartLabel, setBackToStartLabel] = useState(node.data.back_to_start_message_label ?? '');
	const [deleteId, setDeleteId] = useState(node.data.delete_id ?? '');
	const [deleteLabel, setDeleteLabel] = useState(node.data.delete_label ?? '');

	useEffect(() => {
		setRichText(node.data.richText);
		setButtons([...(node.data.buttons ?? [])]);
		setBackLabel(node.data.back_label ?? '');
		setBackToStartLabel(node.data.back_to_start_message_label ?? '');
		setDeleteId(node.data.delete_id ?? '');
		setDeleteLabel(node.data.delete_label ?? '');
	}, [node.id, node]);

	const dialog = useDialog();

	const handleButtonChange = (idx: number, field: keyof NodeButton, value: any) => {
		setButtons((prev) =>
			prev.map((b, i) =>
				i === idx ? { ...b, [field]: value } : b
			)
		);
	};

	const handleDeleteButton = async (idx: number) => {
		const { result } = await dialog({
			dialogId: 'confirmRemoveActionInNode',
			title: 'Удаление',
			content: 'Все связи этой кнопки с блоками будут удалены. Вы уверены, что хотите продолжить?',
			confirmLabel: 'Удалить',
			cancelLabel: 'Отмена',
			showCheckbox: true,
			checkboxLabel: 'Не спрашивать больше'
		});

		if (result) {
			setButtons((prev) => prev.filter((_, i) => i !== idx));
		}
	};

	const handleDeleteNode = async () => {
		if (!isRoot) {
			onDeleteNode && onDeleteNode(node.id);
		}
	}

	const handleAddButton = () => {
		setButtons((prev) => [...prev, { label: 'Новое действие', id: 'button_' + buttons.length }]);
	};

	const handleAddLinkButton = () => {
		setButtons((prev) => [...prev, { label: 'Новая ссылка', external: true, id: 'link_button_' + buttons.length }]);
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
		let data: ButtonNodeData = { ...node.data, richText, buttons: updatedButtons };
		if (isRoot) {
			data = {
				...data,
				back_label: backLabel,
				back_to_start_message_label: backToStartLabel,
				delete_id: deleteId,
				delete_label: deleteLabel
			};
		}
		onSave(data, newActions.length ? newActions : undefined);
	};

	return (
		<div style={styles.editorContainer}>
			<div style={styles.header}>
				<div style={styles.headerTitle}>Редактирование</div>
				<SvgIcon onClick={onClose} cursor={'pointer'}>
					<CloseSvg />
				</SvgIcon>
			</div>
			<div style={styles.content}>
				{isRoot && (
					<div style={styles.rootFields}>
						<div style={styles.rootFieldsTitle}>Поля главного блока</div>
						<div style={styles.rootFieldRow}>
							<label style={styles.rootFieldLabel}>back_label:</label>
							<input
								style={styles.rootFieldInput}
								value={backLabel}
								onChange={e => setBackLabel(e.target.value)}
								placeholder={node.data.back_label || 'back_label'}
							/>
						</div>
						<div style={styles.rootFieldRow}>
							<label style={styles.rootFieldLabel}>back_to_start_message_label:</label>
							<input
								style={styles.rootFieldInput}
								value={backToStartLabel}
								onChange={e => setBackToStartLabel(e.target.value)}
								placeholder={node.data.back_to_start_message_label || 'back_to_start_message_label'}
							/>
						</div>
						<div style={styles.rootFieldRow}>
							<label style={styles.rootFieldLabel}>delete_id:</label>
							<input
								style={styles.rootFieldInput}
								value={deleteId}
								onChange={e => setDeleteId(e.target.value)}
								placeholder={node.data.delete_id || 'delete_id'}
							/>
						</div>
						<div style={styles.rootFieldRow}>
							<label style={styles.rootFieldLabel}>delete_label:</label>
							<input
								style={styles.rootFieldInput}
								value={deleteLabel}
								onChange={e => setDeleteLabel(e.target.value)}
								placeholder={node.data.delete_label || 'delete_label'}
							/>
						</div>
					</div>
				)}

				<div style={styles.blockLabel}>Блок</div>
				<div style={styles.blockTitle}>{node.data.label || 'Без названия'}</div>
				<div style={styles.textareaLabel}>Текст сообщения</div>
				<MarkdownEditor
					value={richText}
					onChange={setRichText}
					maxLength={4096}
				/>

				<div style={styles.actionsLabel}>Кнопки действия</div>
				<div>
					<div style={styles.addButtons}>
						<Button
							size="small"
							variant="contained"
							color="#232324"
							startAdornment={<SvgIcon><PlusSvg /></SvgIcon>}
							onClick={handleAddButton}
						>
                            Кнопка
						</Button>
						<Button
							size="small"
							variant="contained"
							color="#232324"
							startAdornment={<SvgIcon><PlusSvg /></SvgIcon>}
							onClick={handleAddLinkButton}
						>
                            Кнопка-Link
						</Button>
					</div>
					<div style={styles.actionsList}>
						{buttons.map((each, idx) => (
							<div
								key={`${each.target}_${idx}`}
								style={{
									...styles.actionRow,
									...(each.external
										? { background: '#232344', color: '#60b8f2' }
										: {}),
								}}
							>
								<span style={styles.dragHandle}>
									<SvgIcon>
										<DragSvg />
									</SvgIcon>
								</span>
								<input
									value={each.label}
									style={{
										...styles.actionInput,
										...(each.external
											? { fontStyle: 'italic', color: '#60b8f2' }
											: {}),
									}}
									maxLength={128}
									onChange={e => {
										let value = e.target.value;
										if (value.length > 128) {
											value = value.slice(0, 128);
										}
										handleButtonChange(idx, 'label', value);
									}}
									placeholder={each.external ? 'Markdown-ссылка' : 'Текст кнопки'}
								/>
								<span style={styles.actionCounter}>{each.label.length}/128</span>
								<span style={styles.actionWrapper}>
									<SvgIcon
										cursor="pointer"
										onClick={() => handleDeleteButton(idx)}
									>
										<DeleteSvg />
									</SvgIcon>
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<div style={styles.footer}>
				<Button
					size="medium"
					variant="contained"
					color="#1877F2"
					onClick={handleSave}
				>
                    Сохранить
				</Button>
				<Button
					size="medium"
					variant="contained"
					color="#232324"
					onClick={onClose}
				>
                    Отмена
				</Button>
				<div style={styles.footerDelete}>
					<Button
						size="medium"
						disabled={isRoot}
						variant="contained"
						color="#DF5353"
						startAdornment={<SvgIcon><DeleteSvg /></SvgIcon>}
						onClick={handleDeleteNode}
					>
                        Удалить
					</Button>
				</div>
			</div>
		</div>
	);
}
