export function stringCutOff(text: string, maxLength = 128) {
	const needCutOff = text.length > maxLength;
	return needCutOff ? text.slice(0, maxLength) + '…' : text;
}
