import React, { createContext, useContext, useState, ReactNode } from 'react';

import { Dialog } from '../components/shared';

type DialogParams = {
    dialogId: string;
    title?: string;
    content?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    showCheckbox?: boolean;
    checkboxLabel?: string;
};

type DialogResult = boolean; //TODO: может быть сложнее

type ShowDialogFn = (params: DialogParams) => Promise<{ result: DialogResult, dontAskAgain?: boolean }>;

const DialogContext = createContext<ShowDialogFn | null>(null);

export const useDialog = () => {
	const ctx = useContext(DialogContext);
	if (!ctx) {
		throw new Error('useDialog must be used within DialogProvider');
	}
	return ctx;
};

const DONT_ASK_KEY_PREFIX = 'dont_ask_dialog_';

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [dialog, setDialog] = useState<DialogParams | null>(null);
	const [promise, setPromise] = useState<((res: { result: boolean, dontAskAgain?: boolean }) => void) | null>(null);
	const [dontAskAgain, setDontAskAgain] = useState(false);

	const showDialog: ShowDialogFn = (params) => {
		// check if 'dontAskAgain' for this dialogId in localStorage
		const dontAskKey = DONT_ASK_KEY_PREFIX + params.dialogId;
		if (localStorage.getItem(dontAskKey) === '1') {
			return Promise.resolve({ result: true, dontAskAgain: true });
		}

		setDialog(params);
		setDontAskAgain(false);
		return new Promise(resolve => setPromise(() => resolve));
	};

	const handleClose = (result: boolean) => {
		if (dontAskAgain && dialog?.dialogId) {
			localStorage.setItem(DONT_ASK_KEY_PREFIX + dialog.dialogId, '1');
		}
		promise?.({ result, dontAskAgain });
		setDialog(null);
		setPromise(null);
	};

	return (
		<DialogContext.Provider value={showDialog}>
			{children}
			<Dialog
				open={!!dialog}
				title={dialog?.title}
				confirmLabel={dialog?.confirmLabel}
				cancelLabel={dialog?.cancelLabel}
				onConfirm={() => handleClose(true)}
				onCancel={() => handleClose(false)}
				showCheckbox={dialog?.showCheckbox}
				checkboxLabel={dialog?.checkboxLabel}
				checkboxChecked={dontAskAgain}
				onCheckboxChange={setDontAskAgain}
			>
				{dialog?.content}
			</Dialog>
		</DialogContext.Provider>
	);
};
