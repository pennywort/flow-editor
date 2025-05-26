import { useEffect } from 'react';

type HotkeyAction = () => void;

type Hotkey = {
    keys: string;
    callback: HotkeyAction;
    preventDefault?: boolean;
};

const ALIAS: Record<string, string> = {
	command: 'meta',
	cmd: 'meta',
	control: 'ctrl',
};

function normalizeKey(key: string): string {
	key = key.trim().toLowerCase();
	return ALIAS[key] || key;
}

function parseCombo(combo: string): string[] {
	return combo
		.split('+')
		.map(normalizeKey)
		.filter(Boolean)
		.sort(); // Сортируем для порядка (ctrl+shift+f == shift+ctrl+f)
}

function isComboPressed(combo: string[], event: KeyboardEvent): boolean {
	// Массив нажатых
	const pressed: string[] = [];
	if (event.ctrlKey) {
		pressed.push('ctrl');
	}
	if (event.metaKey) {
		pressed.push('meta');
	}
	if (event.altKey) {
		pressed.push('alt');
	}
	if (event.shiftKey) {
		pressed.push('shift');
	}

	const k = event.key.toLowerCase();
	if (!['control', 'ctrl', 'meta', 'command', 'alt', 'shift'].includes(k)) {
		pressed.push(normalizeKey(k));
	}
	pressed.sort();

	return combo.length === pressed.length && combo.every((k, i) => k === pressed[i]);
}

export function useHotkeys(hotkeys: Hotkey[]) {
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			for (const { keys, callback, preventDefault } of hotkeys) {
				const combos = keys.toLowerCase().split('|').map(s => s.trim());
				for (const comboStr of combos) {
					const combo = parseCombo(comboStr);
					if (isComboPressed(combo, event)) {
						if (preventDefault) {
							event.preventDefault();
						}
						callback();
						return;
					}
				}
			}
		};
		window.addEventListener('keydown', handler, { capture: true });
		return () => window.removeEventListener('keydown', handler, { capture: true });
	}, [hotkeys]);
}
