import { jsx as _jsx, jsxs as _jsxs } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { App, Astal } from "astal/gtk3";
import { getMonitorName } from "../../utils/monitor";
import { bind, Variable } from "astal";
import { globalMargin, leftPanelExclusivity, leftPanelLock, leftPanelVisibility, leftPanelWidth, } from "../../variables";
import ChatBot from "./chatBot";
import { WindowActions } from "../../utils/window";
import ToggleButton from "../toggleButton";
import { getSetting, setSetting } from "../../utils/settings";
const provider = Variable(getSetting("chatBot.provider"));
provider.subscribe((value) => setSetting("chatBot.provider", value));
const providers = [
    {
        name: "pollinations",
        icon: "Po",
        description: "Completely free, default model is gpt-4o",
    },
    {
        name: "phind",
        icon: "Ph",
        description: "Uses Phind Model. Great for developers",
    },
];
const ProviderActions = () => (_jsx("box", { className: "provider-actions", vertical: true, children: providers.map((p) => (_jsx(ToggleButton, { state: bind(provider).as((provider) => provider.name === p.name), label: p.icon, onToggled: () => provider.set(p) }))) }));
const Actions = () => (_jsxs("box", { className: "panel-actions", vertical: true, children: [_jsx(ProviderActions, {}), _jsx(WindowActions, { windowWidth: leftPanelWidth, windowExclusivity: leftPanelExclusivity, windowLock: leftPanelLock, windowVisibility: leftPanelVisibility })] }));
function Panel() {
    return (_jsxs("box", { children: [_jsxs("box", { children: [_jsx(Actions, {}), _jsx(ChatBot, { provider: provider })] }), _jsx("eventbox", { onHoverLost: () => {
                    if (!leftPanelLock.get())
                        leftPanelVisibility.set(false);
                }, child: _jsx("box", { css: "min-width:5px" }) })] }));
}
export default (monitor) => {
    return (_jsx("window", { gdkmonitor: monitor, name: `left-panel-${getMonitorName(monitor.get_display(), monitor)}`, namespace: "left-panel", application: App, className: bind(leftPanelExclusivity).as((exclusivity) => exclusivity ? "left-panel exclusive" : "left-panel normal"), anchor: Astal.WindowAnchor.LEFT |
            Astal.WindowAnchor.TOP |
            Astal.WindowAnchor.BOTTOM, exclusivity: bind(leftPanelExclusivity).as((exclusivity) => exclusivity ? Astal.Exclusivity.EXCLUSIVE : Astal.Exclusivity.NORMAL), layer: bind(leftPanelExclusivity).as((exclusivity) => exclusivity ? Astal.Layer.BOTTOM : Astal.Layer.TOP), margin: bind(leftPanelExclusivity).as((exclusivity) => exclusivity ? 0 : globalMargin), keymode: Astal.Keymode.ON_DEMAND, visible: bind(leftPanelVisibility), widthRequest: bind(leftPanelWidth), child: _jsx(Panel, {}) }));
};
