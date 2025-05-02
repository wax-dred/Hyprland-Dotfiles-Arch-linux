import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Astal } from "astal/gtk3";
import { leftPanelLock, leftPanelVisibility } from "../../variables";
export default (monitor) => {
    return (_jsx("window", { gdkmonitor: monitor, className: "LeftPanel", exclusivity: Astal.Exclusivity.IGNORE, layer: Astal.Layer.TOP, anchor: Astal.WindowAnchor.LEFT |
            Astal.WindowAnchor.TOP |
            Astal.WindowAnchor.BOTTOM, child: _jsx("eventbox", { onHover: () => {
                if (!leftPanelLock.get())
                    leftPanelVisibility.set(true);
            }, child: _jsx("box", { css: "min-width: 1px" }) }) }));
};
