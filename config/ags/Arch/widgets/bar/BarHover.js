import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { Astal } from "astal/gtk3";
import { Window } from "../../../../../../usr/share/astal/gjs/gtk3/widget";
import { barOrientation, barVisibility } from "../../variables";
import { bind } from "astal";
export default (monitor) => {
    return (_jsx(Window, { name: "bar-hover", gdkmonitor: monitor, anchor: bind(barOrientation).as((orientation) => orientation
            ? Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            : Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT), exclusivity: Astal.Exclusivity.IGNORE, layer: Astal.Layer.OVERLAY, child: _jsx("eventbox", { onHover: () => {
                barVisibility.set(true);
            }, child: _jsx("box", { css: "min-height: 5px;" }) }) }));
};
