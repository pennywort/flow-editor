import { Controls, ControlButton } from '@xyflow/react';
import { ReactComponent as CollapseSvg } from "../shared/svg/collapse_node.svg";
import {SvgIcon} from "../shared";

export function FlowControls({ onToggleCollapse, collapsed }: { onToggleCollapse: () => void, collapsed: boolean }) {
    return (
        <Controls>
            <ControlButton
                title={collapsed ? "Развернуть все" : "Свернуть все"}
                onClick={onToggleCollapse}
            >
                <SvgIcon><CollapseSvg /></SvgIcon>
            </ControlButton>
        </Controls>
    );
}
