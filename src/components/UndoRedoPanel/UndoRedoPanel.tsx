import React from "react";
import {Button} from "../shared";
import {ReactComponent as UndoSvg} from "../shared/svg/undo.svg";
import {ReactComponent as RedoSvg} from "../shared/svg/redo.svg";
import {panel} from "./styles";

export default function UndoRedoPanel({ onUndo, onRedo, canUndo, canRedo }: {
    onUndo: () => void,
    onRedo: () => void,
    canUndo: boolean,
    canRedo: boolean
}) {
    return (
        <div style={panel}>
            <Button
                size="medium"
                variant="contained"
                color="#232324"
                disabled={!canUndo}
                onClick={onUndo}
            >
                <UndoSvg />
            </Button>
            <Button
                size="medium"
                variant="contained"
                color="#232324"
                disabled={!canRedo}
                onClick={onRedo}
            >
                <RedoSvg />
            </Button>
        </div>
    );
}
