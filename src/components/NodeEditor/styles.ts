import { CSSProperties } from 'react';

export const editorContainer: CSSProperties = {
	position: 'fixed',
	top: 0,
	right: 0,
	width: 550,
	height: '100vh',
	background: '#19191A',
	color: '#fff',
	zIndex: 2000,
	boxShadow: '-2px 0 10px #000a',
	display: 'flex',
	flexDirection: 'column',
	fontFamily: 'inherit',
	boxSizing: 'border-box'
};

export const header: CSSProperties = {
	padding: '5px 15px',
	borderBottom: '1.5px solid #232324',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between'
};

export const headerTitle: CSSProperties = {
	fontWeight: 600,
	fontSize: 20,
};

export const blockLabel: CSSProperties = {
	color: '#868686',
	fontSize: 13,
	marginTop: 18,
	marginBottom: 2
};

export const blockTitle: CSSProperties = {
	fontWeight: 600,
	fontSize: 15,
	marginBottom: 11,
};

export const textareaLabel: CSSProperties = {
	color: '#868686',
	fontSize: 13,
	marginBottom: 2
};

export const textareaWrap: CSSProperties = {
	position: 'relative',
	marginBottom: 8,
};

export const textarea: CSSProperties = {
	width: '100%',
	outline: 'none',
	height: 150,
	fontSize: 13.5,
	color: '#fff',
	background: '#232324',
	border: '1.5px solid #343435',
	borderRadius: 7,
	padding: 8,
	resize: 'none',
	overflowY: 'auto',
	boxSizing: 'border-box'
};

export const textareaCounter: CSSProperties = {
	position: 'absolute',
	right: 7,
	bottom: 3,
	fontSize: 11.5,
	color: '#868686'
};

export const toolbar: CSSProperties = {
	display: 'flex',
	gap: 9,
	marginBottom: 10,
	alignItems: 'center'
};

export const toolbarItem: CSSProperties = {
	cursor: 'pointer',
	width: 24,
	height: 24,
	background: '#232324',
	borderRadius: 5,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center'
};

export const actionsLabel: CSSProperties = {
	fontWeight: 600,
	fontSize: 13.5,
	margin: '14px 0 7px 0'
};

export const content: CSSProperties = {
	flex: 1,
	padding: '0 24px',
	overflow: 'auto',
	display: 'flex',
	flexDirection: 'column',
};

export const actionsList: CSSProperties = {
	flex: '1 1 auto',
	minHeight: 0,
	marginBottom: 12,
	paddingRight: 2,
};

export const actionRow: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	background: '#232324',
	borderRadius: 7,
	marginBottom: 6,
	padding: '2px 5px',
	gap: 4,
	minHeight: 28,
	boxSizing: 'border-box'
};

export const actionWrapper: CSSProperties = {
	cursor: 'pointer',
	userSelect: 'none',
	margin: '0 5px',
	width: 20,
	height: 20,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
};

export const dragHandle: CSSProperties = {
	cursor: 'grab',
	...actionWrapper
};

export const actionInput: CSSProperties = {
	flex: 1,
	background: '#232324',
	border: '1.2px solid #39393D',
	color: '#fff',
	fontSize: 12.5,
	borderRadius: 6,
	padding: '3px 6px',
	outline: 'none',
	minWidth: 0,
	height: 22,
	boxSizing: 'border-box'
};

export const actionCounter: CSSProperties = {
	fontSize: 10.5,
	color: '#868686',
	marginLeft: 3,
	width: 27,
	textAlign: 'right'
};

export const addButtons: CSSProperties = {
	display: 'flex',
	gap: 8,
	marginTop: 0,
	marginBottom: 18
};

export const footer: CSSProperties = {
	padding: '10px 15px',
	borderTop: '1.5px solid #232324',
	display: 'flex',
	alignItems: 'center',
	gap: 10
};

export const footerDelete: CSSProperties = {
	marginLeft: 'auto'
};

export const previewLabel: CSSProperties = {
	fontSize: 14,
	fontWeight: 400,
	color: '#ccc',
	display: 'flex',
	alignItems: 'center',
	marginLeft: 8,
	cursor: 'pointer'
};

export const previewPane: CSSProperties = {
	flex: 1,
	minWidth: 0,
	background: '#19191A',
	color: '#fff',
	border: '1.5px solid #343435',
	borderRadius: 7,
	padding: 10,
	height: 140,
	overflowY: 'auto',
	fontSize: 16
};

export const rootFieldsTitle: CSSProperties = {
	color: '#B4C5E8',
	fontWeight: 700,
	fontSize: 16,
	marginBottom: 9,
	marginTop: 6,
	letterSpacing: 0.4
};

export const rootFieldRow: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: 12,
};
export const rootFieldLabel: CSSProperties = {
	minWidth: 215,
	color: '#B4C5E8',
	fontSize: 14,
	fontWeight: 500,
	textAlign: 'right'
};


export const rootFields: CSSProperties = {
	marginBottom: 24,
	marginTop: 16,
	padding: '12px 0 0 0',
	borderBottom: '1px solid #232324',
	display: 'flex',
	flexDirection: 'column',
	gap: 7,
};

export const rootFieldInput: CSSProperties = {
	flex: 1,
	padding: '4px 7px',
	borderRadius: 6,
	border: '1px solid #39393D',
	background: '#232324',
	color: '#fff',
	fontSize: 14,
	outline: 'none'
};
