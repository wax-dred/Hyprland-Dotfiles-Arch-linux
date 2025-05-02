import { jsx as _jsx } from "/usr/share/astal/gjs/gtk3/jsx-runtime";
import { bind } from "astal";
import Player from "./Player";
import Mpris from "gi://AstalMpris";
import { App, Astal } from "astal/gtk3";
import { barOrientation, globalMargin } from "../variables";
import { hideWindow } from "../utils/window";
import { getMonitorName } from "../utils/monitor";
const mpris = Mpris.get_default();
const players = bind(mpris, "players");
export default (monitor) => {
    const monitorName = getMonitorName(monitor.get_display(), monitor);
    return (_jsx("window", { gdkmonitor: monitor, name: `media-${monitorName}`, namespace: "media", application: App, anchor: bind(barOrientation).as((orientation) => orientation ? Astal.WindowAnchor.TOP : Astal.WindowAnchor.BOTTOM), margin: globalMargin, visible: false, child: _jsx("box", { className: "media-popup", child: _jsx("eventbox", { onHoverLost: () => hideWindow(`media-${monitorName}`), child: _jsx("box", { vertical: true, spacing: 10, children: players.as((p) => p.map((player) => (_jsx(Player, { player: player, playerType: "popup" })))) }) }) }) }));
};
