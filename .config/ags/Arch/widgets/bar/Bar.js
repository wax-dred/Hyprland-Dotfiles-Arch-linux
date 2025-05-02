import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { App, Astal } from "astal/gtk3";
import { bind } from "astal";
import barLeft from "./components/barLeft";
import barMiddle from "./components/barMiddle";
import barRight from "./components/barRight";
import { barLock, barOrientation, barVisibility, emptyWorkspace, globalMargin, } from "../../variables";
import { getMonitorName } from "../../utils/monitor";
export default (monitor) => {
    const monitorName = getMonitorName(monitor.get_display(), monitor);
    return (_jsx("window", { gdkmonitor: monitor, name: `bar-${monitorName}`, namespace: "bar", className: "Bar", application: App, exclusivity: Astal.Exclusivity.EXCLUSIVE, layer: Astal.Layer.TOP, anchor: bind(barOrientation).as((orientation) => orientation
            ? Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            : Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT), margin: emptyWorkspace.as((empty) => (empty ? globalMargin : 5)), visible: bind(barVisibility), child: _jsx("eventbox", { onHoverLost: () => {
                if (!barLock.get())
                    barVisibility.set(false);
            }, child: _jsx("centerbox", { className: emptyWorkspace.as((empty) => empty ? "bar empty" : "bar full"), startWidget: _jsx("box", { name: "start-widget", child: barLeft(monitorName) }), centerWidget: _jsx("box", { name: "center-widget", child: barMiddle(monitorName) }), endWidget: _jsx("box", { name: "end-widget", child: barRight(monitorName) }) }) }) }));
};
