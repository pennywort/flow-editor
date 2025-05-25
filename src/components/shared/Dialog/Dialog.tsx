import React from "react";
import * as styles from "./styles";
import Button from "../Button/Button";

interface DialogProps {
    open: boolean;
    title?: string;
    children?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    showCheckbox?: boolean;
    checkboxLabel?: string;
    checkboxChecked?: boolean;
    onCheckboxChange?: (checked: boolean) => void;
}

const Dialog: React.FC<DialogProps> = ({
                                           open,
                                           title,
                                           children,
                                           confirmLabel = "OK",
                                           cancelLabel = "Cancel",
                                           onConfirm,
                                           onCancel,
                                           showCheckbox,
                                           checkboxLabel,
                                           checkboxChecked,
                                           onCheckboxChange,
                                       }) => {
    if (!open) return null;
    return (
        <div style={styles.overlay}>
            <div style={styles.dialog}>
                {title && <div style={styles.title}>{title}</div>}
                <div style={styles.content}>{children}</div>
                {showCheckbox && (
                    <label style={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={checkboxChecked}
                            onChange={e => onCheckboxChange?.(e.target.checked)}
                            style={styles.checkbox}
                        />
                        {checkboxLabel}
                    </label>
                )}
                <div style={styles.actions}>
                    <Button
                        size="small"
                        variant="contained"
                        color="#232324"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="#1877F2"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
