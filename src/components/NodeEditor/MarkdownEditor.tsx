import React, { useRef, useState } from 'react';

import { MarkdownRenderer } from '../shared';

import { ReactComponent as BoldSvg } from './icons/bold.svg';
import { ReactComponent as ItalicSvg } from './icons/italic.svg';
import { ReactComponent as StrikeSvg } from './icons/strike.svg';
import { ReactComponent as LinkSvg } from './icons/link.svg';
import { ReactComponent as QuoteSvg } from './icons/quote.svg';
import * as styles from './styles';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
	value,
	onChange,
	maxLength = 4096,
}) => {
	const [preview, setPreview] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	function insertMarkdown(wrap: [string, string], placeholder: string) {
		const textarea = textareaRef.current;
		if (!textarea) {
			return;
		}

		const { selectionStart: start, selectionEnd: end, value: text } = textarea;
		const selected = text.slice(start, end);
		const before = text.slice(0, start);
		const after = text.slice(end);

		let newText: string;
		let caretOffset: number;

		if (selected) {
			newText = before + wrap[0] + selected + wrap[1] + after;
			caretOffset = start + wrap[0].length + selected.length + wrap[1].length;
		} else {
			newText = before + wrap[0] + placeholder + wrap[1] + after;
			caretOffset = start + wrap[0].length;
		}
		onChange(newText);

		setTimeout(() => {
			textarea.setSelectionRange(
				caretOffset,
				selected ? caretOffset : caretOffset + placeholder.length
			);
			textarea.focus();
		}, 0);
	}

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
				{/* label убран */}
				<div />
				<label style={styles.previewLabel}>
					<input
						type="checkbox"
						checked={preview}
						onChange={e => setPreview(e.target.checked)}
						style={{ marginRight: 4 }}
					/>
                    Preview
				</label>
			</div>
			<div style={styles.textareaWrap}>
				<textarea
					ref={textareaRef}
					value={value}
					maxLength={maxLength}
					onChange={e => onChange(e.target.value)}
					style={styles.textarea}
					spellCheck={false}
				/>
				<div style={styles.textareaCounter}>
					{value.length}/{maxLength}
				</div>
				<div style={styles.toolbar}>
					<span style={styles.toolbarItem} title="Жирный (*текст*)" onClick={() => insertMarkdown(['*', '*'], 'жирный текст')}>
						<BoldSvg />
					</span>
					<span style={styles.toolbarItem} title="Курсив (_текст_)" onClick={() => insertMarkdown(['_', '_'], 'курсив')}>
						<ItalicSvg />
					</span>
					<span style={styles.toolbarItem} title="Зачеркнутый (~текст~)" onClick={() => insertMarkdown(['~', '~'], 'зачеркнуто')}>
						<StrikeSvg />
					</span>
					<span style={styles.toolbarItem} title="Ссылка ([название](url))" onClick={() => insertMarkdown(['[', '](https://)'], 'название')}>
						<LinkSvg />
					</span>
					<span style={styles.toolbarItem} title="Цитата (> текст)" onClick={() => insertMarkdown(['> ', ''], 'цитата')}>
						<QuoteSvg />
					</span>
				</div>
			</div>
			{preview && (
				<div style={styles.previewPane}>
					<MarkdownRenderer text={value} />
				</div>
			)}
		</div>
	);
};

export default MarkdownEditor;
