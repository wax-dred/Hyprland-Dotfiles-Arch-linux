import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Astal } from "astal/gtk3";
import { rightPanelLock, rightPanelVisibility } from "../../variables";
export default (monitor) => {
    return (_jsx("window", { gdkmonitor: monitor, className: "RightPanel", exclusivity: Astal.Exclusivity.IGNORE, layer: Astal.Layer.TOP, anchor: Astal.WindowAnchor.RIGHT |
            Astal.WindowAnchor.TOP |
            Astal.WindowAnchor.BOTTOM, child: _jsx("eventbox", { onHover: () => {
                if (!rightPanelLock.get())
                    rightPanelVisibility.set(true);
            }, child: _jsx("box", { css: "min-width: 1px" }) }) }));
};
